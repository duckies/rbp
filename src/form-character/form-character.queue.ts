import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EntityManager, MikroORM } from 'mikro-orm';
import { ProfileService } from '../blizzard/services/profile/profile.service';
import { GuildUpdateResult } from '../guild-character/character.queue';
import { FormCharacter } from './form-character.entity';
import { FormCharacterService } from './form-character.service';

interface Results {
  total: number;
  processed: number;
  success: number;
  failed: number;
  deleted: number;
}

@Injectable()
@Processor('form-character')
export class FormCharacterQueue {
  private readonly logger: Logger = new Logger(FormCharacterQueue.name);
  private readonly em: EntityManager;
  private results: GuildUpdateResult;

  constructor(
    private readonly formCharacterService: FormCharacterService,
    private readonly profileService: ProfileService,
    orm: MikroORM,
  ) {
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

  // Characters must be deleted if the status endpoint:
  // 1. Returns 404.
  // 2. The `is_valid` attribute is false.
  // 3. The character id does not match.

  @Process({ name: 'characterUpdate', concurrency: 1 })
  private async updateSubmissionCharacters(job: Job) {
    const formCharacters = await this.em.find(FormCharacter, null);

    this.results.total = formCharacters.length;

    await Promise.all(
      formCharacters.map(async (formCharacter) => {
        try {
          const status = await this.profileService.getCharacterProfileStatus(
            formCharacter.getFindCharacterDTO(),
            formCharacter.last_modified,
          );

          if (status.data.id !== formCharacter.id || status.data.is_valid === false) {
            this.results.deleted++;
            return this.em.remove(FormCharacter, formCharacter);
          }

          formCharacter.last_modified = status.headers['last-modified'];

          await this.formCharacterService.populateFormCharacter(formCharacter);

          this.results.success++;
        } catch (error) {
          if (error instanceof HttpException) {
            if (error.getStatus() === 304) {
              this.results.ignored++;
              return;
            }

            if (error.getStatus() === 404) {
              this.em.remove(FormCharacter, formCharacter);
              this.results.deleted++;
              return;
            }

            this.results.failed++;
            this.logger.error(`Updating Error ${error}`, error.stack);
          }
        }

        job.progress(++this.results.processed / this.results.total);
      }),
    );

    await this.em.flush();
  }

  @OnQueueFailed()
  private onFailed(job: Job<number>, error: Error) {
    console.error(error);
    this.logger.error(error, error.stack);
  }

  @OnQueueError()
  private onError(job: Job<number>, error: Error) {
    console.error(error);
    this.logger.error(error, error.stack);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job) {
    if (job.name === 'characterUpdate') {
      this.logger.log(this.results);
    }
  }
}
