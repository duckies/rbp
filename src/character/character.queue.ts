import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { FindGuildDto } from '../blizzard/dto/find-guild.dto';
import { RealmSlug } from '../blizzard/enum/realm.enum';
import { Region } from '../blizzard/enum/region.enum';
import { ProfileService } from '../blizzard/profile.service';
import { ConfigService } from '../config/config.service';
import { CharacterService, PurgeResult } from './character.service';
import { CharacterConflictException } from '../blizzard/exceptions/character-conflict.exception';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';

export interface GuildUpdateResult {
  success: number;
  failed: number;
  ignored: number;
}

@Processor('character')
export class CharacterQueue {
  private readonly logger: Logger = new Logger(CharacterQueue.name);

  private guildLookup: FindGuildDto = {
    name: 'really-bad-players',
    realm: RealmSlug.Area52,
    region: Region.US,
  };

  private minimumCharacterLevel: number;

  constructor(
    private readonly characterService: CharacterService,
    private readonly profileService: ProfileService,
    private readonly configService: ConfigService,
  ) {
    this.minimumCharacterLevel = Math.max(
      parseInt(this.configService.get('MINIMUM_CHARACTER_LEVEL'), 10),
      10,
    );
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
      guild.members.map(async member => {
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

  // @Process({ name: 'removeNonGuildMembers', concurrency: 1 })
  // private async removeNonGuildMembers(): Promise<unknown> {
  //   const [blizzard, local] = await Promise.all([
  //     this.blizzardService.getGuildRoster(this.guildLookup),
  //     this.characterService.findAllInGuild(),
  //   ]);

  //   // Creates a list of local characters who are not in the guild.
  //   const toRemove: Character[] = local.filter(l => !blizzard.members.some(b => l.name === b.character.name));

  //   // Remove all guild associations.
  //   const promises = [];
  //   for (const character of toRemove) {
  //     this.logger.log(`Removing ${character.name} from the guild.`);

  //     character.guild_id = null;
  //     character.guild_name = null;
  //     character.guild_realm = null;
  //     // Should I just delete them instead?
  //     promises.push(character.removeGuild().save());
  //   }

  //   return Promise.all(promises);
  // }

  @Process({ name: 'purgeGuildRoster', concurrency: 1 })
  private async purgeGuildRoster(): Promise<PurgeResult> {
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
