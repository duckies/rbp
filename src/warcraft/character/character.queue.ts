import {
  Queue,
  QueueProcess,
  OnQueueError,
  OnQueueCompleted,
  OnQueueFailed,
} from 'nest-bull';
import { Logger } from '@nestjs/common';
import { CharacterService } from './character.service';
import { Job } from 'bull';
import { BlizzardService } from '../blizzard/blizzard.service';
import { GuildLookupDto } from '../blizzard/dto/guild-lookup.dto';
import { GuildFieldsDto, GuildFields } from '../blizzard/dto/guild-fields.dto';
import { ConfigService } from '../../config/config.service';
import { Character } from './character.entity';
import {
  CharacterLookupDto,
  CharacterFieldsDto,
  CharacterFields,
} from '../blizzard/dto/get-character.dto';
import Guild from '../../../interfaces/guild';

@Queue({ name: 'character' })
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
    this.guildLookup.realm = 'Blackrock';
    this.guildLookup.region = 'us';
    this.guildFields.fields = [GuildFields.Members];
    this.minimumCharacterLevel = parseInt(
      this.configService.get('MINIMUM_CHARACTER_LEVEL'),
      10,
    );
  }

  @QueueProcess({ name: 'updateGuildRoster', concurrency: 1 })
  private async updateGuildRoster(job: Job<Number>) {
    let progress = 0,
      success = 0,
      failed = 0,
      ignored = 0;

    const guild = await this.blizzardService.getGuild(
      this.guildLookup,
      this.guildFields,
    );

    // Do not include characters not meeting threshold.
    // Undecided if I want to do this, as the roster could include them later.
    // guild.members.filter(a => a.level >= this.minimumCharacterLevel)

    const promises = guild.members.map(async member => {
      const { character, rank } = member;
      const lookup = new CharacterLookupDto(character.name, character.realm);

      try {
        const character = await this.characterService.upsert(
          lookup,
          this.fields,
          false,
          true,
          rank,
        );

        if (character.notUpdated) ignored++;
        else success++;

        return character;
      } catch (error) {
        this.logger.error(error.message.error);
        failed++;
      } finally {
        job.progress(++progress / promises.length);
      }
    });

    await Promise.all(promises);

    return Promise.resolve({ success, failed, ignored });
  }

  @QueueProcess({ name: 'removeNonGuildMembers', concurrency: 1 })
  private async removeNonGuildMembers(job: Job<Number>) {
    const [blizzard, local]: [Guild, Character[]] = await Promise.all([
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

  @QueueProcess({ name: 'purgeGuildRoster', concurrency: 1 })
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
        `Roster update completed with ${result.success} updated ${
          result.failed
        } failed and ${result.ignored} ignored.`,
      );
    } else if (job.name === 'purgeGuildRoster') {
      this.logger.log(
        `Purge marked ${result.flagged} characters as deleted, removed ${
          result.deleted
        } characters.`,
      );
    }
  }

  // @OnQueueProgress()
  // private onProgress(job: Job<Number>, progress: number) {
  //   this.logger.log(`Guild progress: ${progress}`);
  // }

  @OnQueueFailed()
  private onFailed(job: Job<Number>, error: Error) {
    this.logger.error('erroryerror' + error);
  }
}
