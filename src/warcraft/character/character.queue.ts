import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueError, OnQueueFailed, Process, Processor } from 'nest-bull';
import { ConfigService } from '../../config/config.service';
import { BlizzardService } from '../blizzard/blizzard.service';
import { RealmNameDictionary } from '../blizzard/realm.map';
import { CharacterFieldsDto } from '../dto/fields.dto';
import { CharacterLookupDto } from '../dto/get-character.dto';
import { GuildLookupDto } from '../dto/guild-lookup.dto';
import { CharacterFields } from '../interfaces/character.interface';
import GuildResponse from '../interfaces/guild.interface';
import { RealmSlug } from '../interfaces/realm.enum';
import { Character } from './character.entity';
import { CharacterService, PurgeResult } from './character.service';

@Processor({ name: 'character' })
export class CharacterQueue {
  private readonly logger: Logger = new Logger(CharacterQueue.name);

  private guildLookup: GuildLookupDto = new GuildLookupDto();

  private readonly fields: CharacterFieldsDto = new CharacterFieldsDto([
    CharacterFields.Items,
    CharacterFields.Mounts,
    CharacterFields.PVP,
    CharacterFields.Pets,
    CharacterFields.Professions,
    CharacterFields.Progression,
    CharacterFields.Talents,
    CharacterFields.Titles,
  ]);

  private minimumCharacterLevel: number;

  constructor(
    private readonly characterService: CharacterService,
    private readonly blizzardService: BlizzardService,
    private readonly configService: ConfigService,
  ) {
    this.guildLookup.name = 'Really Bad Players';
    this.guildLookup.realm = RealmSlug.Blackrock;
    this.guildLookup.region = 'us';
    this.minimumCharacterLevel = parseInt(this.configService.get('MINIMUM_CHARACTER_LEVEL'), 10);
  }

  @Process({ name: 'updateGuildRoster', concurrency: 1 })
  private async updateGuildRoster(job: Job<number>): Promise<{ success: number; failed: number; ignored: number }> {
    let progress = 0;
    let success = 0;
    let failed = 0;
    let ignored = 0;

    const guild = await this.blizzardService.fetchGuild(this.guildLookup);

    // Do not include characters not meeting threshold.
    // Undecided if I want to do this, as the roster could include them later.
    // guild.members.filter(a => a.level >= this.minimumCharacterLevel)

    // Characters below level 10 do not work on the API.
    guild.members = guild.members.filter(c => c.character.level > 10);

    const promises = guild.members.map(async member => {
      const lookup = new CharacterLookupDto(member.character.name, RealmNameDictionary[member.character.realm]);

      try {
        const character = await this.characterService.upsert(lookup, false, true, member.rank);

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

  @Process({ name: 'removeNonGuildMembers', concurrency: 1 })
  private async removeNonGuildMembers(): Promise<unknown> {
    const [blizzard, local]: [GuildResponse, Character[]] = await Promise.all([
      this.blizzardService.fetchGuild(this.guildLookup),
      this.characterService.findAllInGuild(),
    ]);

    // Creates a list of local characters who are not in the guild.
    const toRemove: Character[] = local.filter(l => !blizzard.members.some(b => l.name === b.character.name));

    // Remove all guild associations.
    const promises = [];
    for (const character of toRemove) {
      this.logger.log(`Removing ${character.name} from the guild.`);

      promises.push(character.removeGuild().save());
    }

    return Promise.all(promises);
  }

  @Process({ name: 'purgeGuildRoster', concurrency: 1 })
  private async purgeGuildRoster(): Promise<PurgeResult> {
    return await this.characterService.purgeRoster();
  }

  @OnQueueError()
  private onError(_job: Job<number>, error: Error): void {
    this.logger.error(error);
  }

  // @OnQueueCompleted()
  // private onCompleted(
  //   job: Job<number>,
  //   result: { success: number; failed: number; ignored: number } | { flagged: number; deleted: number },
  // ): void {
  //   if (job.name === 'updateGuildRoster') {
  //     this.logger.log(
  //       `Roster update completed with ${result.success} updated ${result.failed} failed and ${result.ignored} ignored.`,
  //     );
  //   } else if (job.name === 'purgeGuildRoster') {
  //     this.logger.log(`Purge marked ${result.flagged} characters as deleted, removed ${result.deleted} characters.`);
  //   }
  // }

  @OnQueueFailed()
  private onFailed(_job: Job<number>, error: Error): void {
    this.logger.error(`erroryerror${error}`);
  }
}
