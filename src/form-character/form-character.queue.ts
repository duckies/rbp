import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Job } from 'bull';
import { EntityManager, MikroORM } from 'mikro-orm';
import { ProfileService } from '../blizzard/services/profile/profile.service';
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

  constructor(
    private readonly formCharacterService: FormCharacterService,
    private readonly profileService: ProfileService,
    orm: MikroORM,
  ) {
    this.em = orm.em.fork();
  }

  @Process({ name: 'characterUpdate', concurrency: 1 })
  private async updateSubmissionCharacters(job: Job<number>) {
    const results: Results = {
      processed: 0,
      success: 0,
      deleted: 0,
      failed: 0,
      total: 0,
    };

    const formCharacters = await this.em.find(FormCharacter, null);

    results.total = formCharacters.length;

    // Characters must be deleted if the status endpoint:
    // 1. Returns 404.
    // 2. The `is_valid` attribute is false.
    // 3. The character id does not match.
    for (const formCharacter of formCharacters) {
      let mustDelete: boolean;

      try {
        const status = await this.profileService.getCharacterProfileStatus(
          formCharacter.getFindCharacterDTO(),
        );

        if (status.id !== formCharacter.character_id || status.is_valid === false) {
          mustDelete = true;
        }
      } catch (error) {
        if (error instanceof NotFoundException) mustDelete = true;

        this.logger.error('Status retrieval error', error.stack);
        results.failed++;

        continue;
      }

      if (mustDelete) {
        this.em.remove(FormCharacter, formCharacter);
        results.deleted++;
        results.processed++;
        continue;
      }

      await this.formCharacterService.populateFormCharacter(formCharacter);

      await this.em.flush();

      results.success++;
      job.progress(++results.processed / formCharacters.length);
    }

    return results;
  }

  @OnQueueFailed()
  private onFailed(job: Job<number>, error: Error) {
    console.error(error);
    this.logger.error(error, error.stack);
  }

  @OnQueueError()
  private onError(job: Job<number>, error: Error) {
    console.error(error.stack);
    this.logger.error(error, error.stack);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<number>, { total, success, failed, deleted }: Results) {
    if (job.name === 'characterUpdate') {
      this.logger.log(`${success} updated, ${failed} failed, and ${deleted} deleted of ${total} total.`);
    }
  }
}
