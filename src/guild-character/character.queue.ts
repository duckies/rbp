import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { EntityManager, MikroORM } from 'mikro-orm';
import moment from 'moment';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { FindGuildDto } from '../blizzard/dto/find-guild.dto';
import { RealmSlug } from '../blizzard/enums/realm.enum';
import { Region } from '../blizzard/enums/region.enum';
import { CharacterConflictException } from '../blizzard/exceptions/character-conflict.exception';
import { ProfileService } from '../blizzard/services/profile/profile.service';
import { GuildCharacter } from './character.entity';
import { CharacterService, PurgeResult } from './character.service';

export interface GuildUpdateResult {
  success: number;
  failed: number;
  ignored: number;
}

@Processor('character')
export class CharacterQueue {
  private readonly logger: Logger = new Logger(CharacterQueue.name);
  private readonly em: EntityManager;

  private guildLookup: FindGuildDto = {
    name: 'really-bad-players',
    realm: RealmSlug.Area52,
    region: Region.US,
  };

  private minimumCharacterLevel: number;

  constructor(
    private readonly characterService: CharacterService,
    private readonly profileService: ProfileService,
    private readonly config: ConfigService,
    private readonly orm: MikroORM,
  ) {
    this.minimumCharacterLevel = Math.max(this.config.get<number>('MINIMUM_CHARACTER_LEVEL'), 10);
    this.em = orm.em.fork();
  }

  /**
   * Recurring guild roster update process.
   *
   * Downloads the guild roster and attempts to perform character upserts.
   * In the event of a broken character, it is deleted.
   */
  @Process({ name: 'updateGuildRoster', concurrency: 1 })
  private async updateGuildRoster(job: Job<number>): Promise<GuildUpdateResult> {
    let progress = 0,
      success = 0,
      failed = 0,
      ignored = 0;

    // Note that this fails without explanation.
    const guild = await this.profileService.getGuildRoster(this.guildLookup, this.minimumCharacterLevel);

    await Promise.all(
      guild.members.map(async (member) => {
        const findCharacterDto = new FindCharacterDto(member.character.name);

        try {
          const character = await this.characterService.upsert(findCharacterDto, member.rank);

          if (character.notUpdated) {
            ignored++;
          } else {
            success++;
          }

          return character;
        } catch (error) {
          // Delete the conflicted character then attempt reinsertion.
          if (error instanceof CharacterConflictException) {
            await this.characterService.delete(findCharacterDto);
            await this.characterService.upsert(findCharacterDto, member.rank);
          } else if (error.message && error.message.error) {
            this.logger.error(error.message.error);
          } else {
            console.log(error);
            this.logger.error(`${error}`);
          }
          failed++;
        } finally {
          job.progress(++progress / guild.members.length);
        }
      }),
    );

    return Promise.resolve({ success, failed, ignored });
  }

  @Process({ name: 'removeNonGuildMembers', concurrency: 1 })
  private async removeNonGuildMembers() {
    const [blizzard, local] = await Promise.all([
      this.profileService.getGuildRoster(this.guildLookup, this.minimumCharacterLevel),
      this.characterService.findAllInGuild(),
    ]);

    // Creates a list of local characters who are not in the guild.
    const missing: GuildCharacter[] = local.filter(
      (l) => !blizzard.members.some((b) => l.name === b.character.name),
    );

    if (missing.length) {
      this.logger.log(`Found ${missing.length} missing guild characters.`);
      await this.characterService.setCharactersMissing(missing, moment.utc().toDate());
    } else {
      this.logger.log(`No missing guild characters.`);
    }
  }

  @Process({ name: 'purgeGuildRoster', concurrency: 1 })
  private async purgeGuildRoster() {
    return await this.characterService.purgeRoster();
  }

  @OnQueueError()
  private onError(_job: Job<number>, error: Error): void {
    this.logger.error('Global Error: ' + error);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<number>, result: GuildUpdateResult | PurgeResult): void {
    if (job.name === 'updateGuildRoster') {
      this.logger.log(
        `Roster update completed with ${(result as GuildUpdateResult).success} updated ${
          (result as GuildUpdateResult).failed
        } failed and ${(result as GuildUpdateResult).ignored} ignored.`,
      );
    } else if (job.name === 'purgeGuildRoster') {
      this.logger.log(
        `Purge marked ${(result as PurgeResult).flagged} characters as deleted, removed ${
          (result as PurgeResult).deleted
        } characters.`,
      );
    }
  }

  @OnQueueFailed()
  private onFailed(_job: Job<number>, error: Error): void {
    this.logger.error(`${error}`);
  }
}
