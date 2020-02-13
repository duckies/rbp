import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from 'nest-bull';
import { FindGuildDto } from '../blizzard/dto/find-guild.dto';
import { RealmSlug } from '../blizzard/enum/realm.enum';
import { Region } from '../blizzard/enum/region.enum';
import { ProfileService } from '../blizzard/profile.service';
import { ConfigService } from '../config/config.service';
import { CharacterService, PurgeResult } from './character.service';

export interface GuildUpdateResult {
  success: number;
  failed: number;
  ignored: number;
}

@Processor({ name: 'character' })
export class CharacterQueue {
  private readonly logger: Logger = new Logger(CharacterQueue.name);

  private guildLookup: FindGuildDto = { name: 'really-bad-players', realm: RealmSlug.Area52, region: Region.US };

  private minimumCharacterLevel: number;

  constructor(
    private readonly characterService: CharacterService,
    private readonly profileService: ProfileService,
    private readonly configService: ConfigService,
  ) {
    this.minimumCharacterLevel = parseInt(this.configService.get('MINIMUM_CHARACTER_LEVEL'), 10);
  }

  @Process({ name: 'updateGuildRoster', concurrency: 1 })
  private async updateGuildRoster(job: Job<number>): Promise<GuildUpdateResult> {
    let progress = 0;
    let success = 0;
    let failed = 0;
    let ignored = 0;

    const guild = await this.profileService.getGuildRoster(this.guildLookup);

    // Do not include characters not meeting threshold.
    guild.members.filter(m => m.character.level >= this.minimumCharacterLevel);

    // Characters below level 10 do not work on the API.
    // guild.members = guild.members.filter(m => m.character.level > 10);

    const promises = guild.members.map(async member => {
      try {
        const character = await this.characterService.upsert(
          { name: member.character.name, realm: RealmSlug.Area52, region: Region.US },
          member.rank,
        );

        if (character.notUpdated) {
          ignored++;
        } else {
          success++;
        }

        return character;
      } catch (error) {
        if (error.message && error.message.error) {
          this.logger.error(error.message.error);
        } else {
          this.logger.error(error);
        }
        failed++;
      } finally {
        job.progress(++progress / promises.length);
      }
    });

    await Promise.all(promises);

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
    this.logger.error(error);
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
    this.logger.error(`erroryerror${error}`);
  }
}
