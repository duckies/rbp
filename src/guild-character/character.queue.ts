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
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { FindGuildDto } from '../blizzard/dto/find-guild.dto';
import { RealmSlug } from '../blizzard/enums/realm.enum';
import { Region } from '../blizzard/enums/region.enum';
import { ProfileService } from '../blizzard/services/profile/profile.service';
import { GuildCharacter } from './character.entity';
import { CharacterService } from './character.service';

export interface GuildUpdateResult {
  processed: number;
  added: number;
  success: number;
  deleted: number;
  ignored: number;
  missing: number;
  failed: number;
  total: number;
}

@Processor('character')
export class CharacterQueue {
  private readonly logger: Logger = new Logger(CharacterQueue.name);
  private readonly em: EntityManager;
  private results: GuildUpdateResult;

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
    orm: MikroORM,
  ) {
    this.minLVL = Math.max(
      this.config.get<number>('MINIMUM_CHARACTER_LEVEL'),
      10,
    );
    this.em = orm.em.fork();
    this.setup();
  }

  private setup() {
    this.results = {
      processed: 0,
      added: 0,
      success: 0,
      deleted: 0,
      ignored: 0,
      missing: 0,
      failed: 0,
      total: 0,
    };
  }

  @Process({ name: 'update-guild-members', concurrency: 1 })
  private async updateGuildMembers(job: Job) {
    const [guildCharacters, roster] = await Promise.all([
      this.em.find(GuildCharacter, null),
      this.profileService.getGuildRoster(this.findGuildDTO, this.minLVL),
    ]);

    this.results.total = roster.data.members.length;

    await Promise.all(
      roster.data.members.map(async (member) => {
        let guildCharacter = guildCharacters.find(
          (c) => c.id === member.character.id,
        );

        try {
          if (!guildCharacter) {
            guildCharacter = new GuildCharacter(
              member.character.name,
              member.character.realm.slug,
              Region.US,
            );

            this.em.persist(guildCharacter);
            this.results.added++;
          } else {
            const status = await this.profileService.getCharacterProfileStatus(
              guildCharacter.getFindCharacterDTO(),
              guildCharacter.last_modified,
            );

            if (
              status.data.is_valid === false ||
              status.data.id !== guildCharacter.id
            ) {
              this.results.deleted++;
              return this.em.remove(GuildCharacter, guildCharacter);
            }

            guildCharacter.last_modified = status.headers['last-modified'];
          }

          guildCharacter.guild_rank = member.rank;

          await this.characterService.populateGuildCharacter(guildCharacter);

          this.results.success++;
        } catch (error) {
          if (error instanceof HttpException) {
            if (error.getStatus() === 304) {
              this.results.ignored++;
              return;
            }

            if (error.getStatus() === 404) {
              this.em.remove(GuildCharacter, guildCharacter);
              return;
            }
          }

          this.logger.error(`Updating Error ${error}`, error.trace);
        }

        job.progress(++this.results.processed / this.results.total);
      }),
    );

    await this.em.flush();
  }

  @Process({ name: 'add-remove-members', concurrency: 1 })
  private async addOrRemoveMembers() {
    const roster = await this.profileService.getGuildRoster(this.findGuildDTO);

    const ids = roster.data.members.map((m) => m.character.id);

    const notInGuild = await this.em.find(GuildCharacter, {
      id: { $nin: ids },
    });

    this.logger.log(`Removing member(s) ${notInGuild.map((m) => m.name)}`);

    this.em.remove(GuildCharacter, notInGuild);

    await this.em.flush();
  }

  @OnQueueError()
  private onError(_job: Job<number>, error: Error): void {
    this.logger.error('Global Error: ' + error);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<number>): void {
    if (job.name === 'update-guild-members') {
      // this.logger.log(`${result.success} updated ${result.failed} failed and ${result.ignored} ignored.`);
      this.logger.log(this.results);
    }
  }

  @OnQueueFailed()
  private onFailed(_job: Job<number>, error: Error): void {
    this.logger.error(`${error}`);
  }
}
