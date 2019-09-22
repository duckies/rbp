import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from 'nest-bull';
import { ConfigService } from '../../config/config.service';
import { BlizzardService } from '../blizzard/blizzard.service';
import { CharacterFieldsDto, CharacterLookupDto } from '../dto/get-character.dto';
import { GuildFields, GuildFieldsDto } from '../dto/guild-fields.dto';
import { GuildLookupDto } from '../dto/guild-lookup.dto';
import { RealmNameDictionary } from '../blizzard/realm.map';
import { CharacterFields } from '../interfaces/character.interface';
import GuildResponse from '../interfaces/guild.interface';
import { RealmSlug } from '../interfaces/realm.enum';
import { Character } from './character.entity';
import { CharacterService } from './character.service';

@Processor({ name: 'character' })
export class CharacterQueue {
  private readonly logger: Logger = new Logger(CharacterQueue.name);
  private guildLookup: GuildLookupDto = new GuildLookupDto();
  private guildFields: GuildFieldsDto = new GuildFieldsDto();
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
    this.guildFields.fields = [GuildFields.Members];
    this.minimumCharacterLevel = parseInt(this.configService.get('MINIMUM_CHARACTER_LEVEL'), 10);
  }

  @Process({ name: 'updateGuildRoster', concurrency: 1 })
  private async updateGuildRoster(job: Job<Number>) {
    let progress = 0,
      success = 0,
      failed = 0,
      ignored = 0;

    const guild = await this.blizzardService.getGuild(this.guildLookup, this.guildFields);

    // Do not include characters not meeting threshold.
    // Undecided if I want to do this, as the roster could include them later.
    // guild.members.filter(a => a.level >= this.minimumCharacterLevel)

    // Characters below level 10 do not work on the API.
    guild.members = guild.members.filter(c => c.character.level > 10);

    const promises = guild.members.map(async member => {
      const { character, rank } = member;
      const lookup = new CharacterLookupDto(character.name, RealmNameDictionary[character.realm]);

      try {
        const character = await this.characterService.upsert(
          lookup,
          this.fields,
          false,
          true,
          rank,
        );

        if (character.notUpdated) { ignored++; }
        else { success++; }

        return character;
      } catch (error) {
        if (error.message && error.message.error) { this.logger.error(error.message.error); }
        else { this.logger.error(error); }
        failed++;
      } finally {
        job.progress(++progress / promises.length);
      }
    });

    await Promise.all(promises);

    return Promise.resolve({ success, failed, ignored });
  }

  @Process({ name: 'removeNonGuildMembers', concurrency: 1 })
  private async removeNonGuildMembers(job: Job<Number>) {
    const [blizzard, local]: [GuildResponse, Character[]] = await Promise.all([
      this.blizzardService.getGuild(this.guildLookup, this.guildFields),
      this.characterService.findAllInGuild(),
    ]);

    // Creates a list of local characters who are not in the guild.
    const toRemove: Character[] = local.filter(
      l => !blizzard.members.some(b => l.name === b.character.name),
    );

    // Remove all guild associations.
    const promises = [];
    for (const character of toRemove) {
      this.logger.log(`Removing ${character.name} from the guild.`);

      promises.push(character.removeGuild().save());
    }

    return Promise.all(promises);
  }

  @Process({ name: 'purgeGuildRoster', concurrency: 1 })
  private async purgeGuildRoster(job: Job<Number>) {
    return await this.characterService.purgeRoster();
  }

  @OnQueueError()
  private onError(job: Job<Number>, error: Error) {
    this.logger.error(error);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<Number>, result: any) {
    if (job.name === 'updateGuildRoster') {
      this.logger.log(
        `Roster update completed with ${result.success} updated ${result.failed} failed and ${
          result.ignored
        } ignored.`,
      );
    } else if (job.name === 'purgeGuildRoster') {
      this.logger.log(
        `Purge marked ${result.flagged} characters as deleted, removed ${
          result.deleted
        } characters.`,
      );
    }
  }

  @OnQueueFailed()
  private onFailed(job: Job<Number>, error: Error) {
    this.logger.error('erroryerror' + error);
  }
}
