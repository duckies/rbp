import { OnQueueCompleted, Process, Processor, OnQueueError } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EntityRepository } from 'mikro-orm';
import { InjectRepository } from 'nestjs-mikro-orm';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ProfileService } from '../blizzard/profile.service';
import { FormCharacter } from './form-character.entity';
import { FormCharacterService } from './form-character.service';

interface FormCharacterUpdateResult {
  deleted: number;
  failed: number;
  success: number;
}

@Injectable()
@Processor('form-character')
export class FormCharacterQueue {
  private readonly logger: Logger = new Logger(FormCharacterQueue.name);

  constructor(
    @InjectRepository(FormCharacter)
    private readonly formCharacterRepository: EntityRepository<FormCharacter>,
    private readonly formCharacterService: FormCharacterService,
    private readonly profileService: ProfileService,
  ) {}

  @Process({ name: 'characterUpdate', concurrency: 1 })
  private async updateSubmissionCharacters(job: Job<number>) {
    let progress = 0,
      success = 0,
      deleted = 0,
      failed = 0;

    const characters = await this.formCharacterService.findAll();

    await Promise.all(
      characters.map(async (character) => {
        const findCharacterDto = new FindCharacterDto(character.name, character.realm, character.region);
        let shouldDelete = false;

        // Characters must be deleted if this endpoint returns 404, the 'is_valid' attribute
        // is false, or if the id of the character provided does not match stored records.
        try {
          const status = await this.profileService.getCharacterProfileStatus(findCharacterDto);

          if (status.id !== character.character_id || status.is_valid === false) {
            shouldDelete = true;
            deleted++;
          }
        } catch (error) {
          if (error.response && error.response.code === 404) {
            this.logger.error(`Deleting application character ${character.name}-${character.realm}`);
            shouldDelete = true;
            deleted++;
          }

          this.logger.error(`${error}`);

          failed++;
        } finally {
          job.progress(++progress / characters.length);
        }

        if (shouldDelete) {
          this.formCharacterRepository.removeLater(character);
        } else {
          try {
            const formCharacter = await this.formCharacterService.create(findCharacterDto);

            // Remove properties we don't want to be overwritten.
            delete formCharacter.isMain;
            delete formCharacter.createdAt;
            delete formCharacter.updatedAt;

            character.assign(formCharacter);
            success++;
          } catch (error) {
            this.logger.error('Error updating form character: ', error);
            failed++;
          }
        }
      }),
    );

    await this.formCharacterRepository.flush();

    return Promise.resolve({ success, deleted, failed });
  }

  @OnQueueError()
  private onError(job: Job<number>, error: Error) {
    this.logger.error(error);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<number>, result: FormCharacterUpdateResult) {
    if (job.name === 'characterUpdate') {
      this.logger.log(
        `Applicant characters updated with ${result.success} updated, ${result.failed} failed, and ${result.deleted} deleted.`,
      );
    }
  }
}
