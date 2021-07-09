import { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/nestjs';
import {
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { FindGuildDto } from '../blizzard/dto/find-guild.dto';
import { RealmSlug } from '../blizzard/enums/realm.enum';
import { Region } from '../blizzard/enums/region.enum';
import { ProfileService } from '../blizzard/services/profile/profile.service';
import { GuildCharacter } from './character.entity';
import { CharacterService } from './character.service';
import { CharacterRemoveResult } from './interfaces/character-remove.interface';
import { CharacterUpdateResult } from './interfaces/character-update.interface';

@Processor('character')
export class CharacterQueue {
  private readonly logger: Logger = new Logger(CharacterQueue.name);

  private findGuildDTO: FindGuildDto = {
    name: 'really-bad-players',
    realm: RealmSlug.Area52,
    region: Region.US,
  };

  private minLVL: number;

  constructor(
    private readonly characterService: CharacterService,
    private readonly profileService: ProfileService,
    private readonly config: ConfigService,
    private readonly orm: MikroORM,
  ) {
    this.minLVL = Math.max(
      this.config.get<number>('MINIMUM_CHARACTER_LEVEL'),
      10,
    );
  }

  @Process({ name: 'update-guild-members', concurrency: 1 })
  @UseRequestContext()
  private async updateGuildMembers(job: Job): Promise<CharacterUpdateResult> {
    try {
      const [characters, roster] = await Promise.all([
        this.orm.em.find(GuildCharacter, {}),
        this.profileService.getGuildRoster(this.findGuildDTO, this.minLVL),
      ]);

      const results: CharacterUpdateResult = {
        total: roster.data.members.length,
        processed: 0,
        success: 0,
        deleted: 0,
        ignored: 0,
        failed: 0,
      };

      try {
        await Promise.all(
          roster.data.members.map(async (member) => {
            let character = characters.find(
              (c) => c.id === member.character.id,
            );

            try {
              if (!character) {
                character = new GuildCharacter(
                  member.character.name,
                  member.character.realm.slug,
                  Region.US,
                );

                await this.characterService.populateGuildCharacter(character);

                // This can be missing if the profile summary fails.
                if (character.id) {
                  this.orm.em.persist(character);
                  character.guild_rank = member.rank;

                  results.added++;
                }
              } else {
                const status =
                  await this.profileService.getCharacterProfileStatus(
                    character.getFindCharacterDTO(),
                    character.last_modified,
                  );

                if (!status.data.is_valid || status.data.id !== character.id) {
                  results.deleted++;
                  this.orm.em.remove(character);
                } else {
                  character.last_modified = status.headers['last-modified'];
                }
              }

              results.success++;
            } catch (error) {
              if (!(error instanceof HttpException)) {
                console.error('ERRROR', error);
              }

              if (error instanceof HttpException) {
                if (error.getStatus() === 304) {
                  results.ignored++;
                  return;
                }

                if (error.getStatus() === 404) {
                  this.orm.em.remove(character);
                  return;
                }
              }

              this.logger.error(error.message, error.stack);
            }

            job.progress(++results.processed / results.total);
          }),
        );
      } catch (error) {
        console.error('UNHANDLED', error);
      }

      await this.orm.em.flush();

      console.log(results);

      return results;
    } catch (error) {
      console.error('Top?', error);
    }
  }

  @Process({ name: 'add-remove-members', concurrency: 1 })
  private async addOrRemoveMembers(): Promise<CharacterRemoveResult> {
    const roster = await this.profileService.getGuildRoster(this.findGuildDTO);

    const ids = roster.data.members.map((m) => m.character.id);

    const notInGuild = await this.orm.em.find(GuildCharacter, {
      id: { $nin: ids },
    });

    const names = notInGuild.map((m) => m.name);

    this.orm.em.remove(notInGuild);

    await this.orm.em.flush();

    return { names };
  }

  @OnQueueError()
  private onError(_job: Job<number>, error: Error): void {
    this.logger.error('Global Error: ' + error, error.stack, error.message);
  }

  @OnQueueCompleted()
  private onCompleted(
    job: Job<number>,
    results: CharacterUpdateResult | CharacterRemoveResult,
  ): void {
    if (job.name === 'update-guild-members') {
      const statuses = [];

      Object.keys(results).forEach((r) => {
        if (r === 'processed' || r === 'total' || results[r] === 0) return;

        statuses.push(
          `${results[r]} ${r.charAt(0).toUpperCase() + r.slice(1)}`,
        );
      });

      this.logger.log(
        `[Updated ${
          (results as CharacterUpdateResult).total
        } Guild Characters]: ${statuses.join(', ')}`,
      );
    }

    if (job.name === 'add-remove-members') {
      const len = (results as CharacterRemoveResult).names.length;
      this.logger.log(
        `Removed ${len} Character${len === 0 ? 's' : len === 1 ? ':' : 's:'} ${(
          results as CharacterRemoveResult
        ).names.join(', ')}`,
      );
    }
  }

  @OnQueueFailed()
  private onFailed(_job: Job<number>, error: Error): void {
    console.error('Error2', error);
    this.logger.error(error);
  }
}
