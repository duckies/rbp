import {
  Queue,
  QueueProcess,
  OnQueueError,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueProgress,
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
    const promises: Promise<Character>[] = [];
    let progress = 0,
      success = 0,
      failed = 0,
      ignored = 0,
      deleted = 0;

    const guild = await this.blizzardService.getGuild(
      this.guildLookup,
      this.guildFields,
    );

    // Do not include characters not meeting threshold.
    // Undecided if I want to do this, as the roster could include them later.
    // guild.members.filter(a => a.level >= this.minimumCharacterLevel)

    for (const slot of guild.members) {
      const lookup = new CharacterLookupDto(
        slot.character.name,
        slot.character.realm,
      );

      promises.push(
        this.characterService.upsert(
          lookup,
          this.fields,
          false,
          true,
          slot.rank,
          null,
        ),
      );
    }

    promises.forEach(p =>
      p
        .then(character => {
          if (character.notUpdated) {
            ignored++;
          } else {
            success++;
          }
        })
        .catch(e => {
          this.logger.error('Character ' + e);
          failed++;
        })
        .finally(() => job.progress(++progress / promises.length)),
    );

    await Promise.all(promises.map(p => p.catch(e => e)));

    // Experimental logic for removing outdated characters:
    // Soft delete accounts older than 72 hours, hard delete after a week.

    return Promise.resolve({ success, failed, ignored });
  }

  @QueueProcess({ name: 'removeNonGuildMembers', concurrency: 1 })
  private async removeNonGuildMembers(job: Job<Number>) {
    
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
        `Roster job ${job.id} completed with ${result.success} updated ${
          result.failed
        } failed and ${result.ignored} ignored.`,
      );
    } else if (job.name === 'purgeGuildRoster') {
      this.logger.log(
        `Purge[${job.id}] marked ${
          result.flagged
        } characters as deleted, removed ${result.deleted} characters.`,
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
