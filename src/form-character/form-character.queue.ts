import { Process, Processor, OnQueueCompleted } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { FormCharacterService } from './form-character.service';
import { ProfileService } from '../blizzard/profile.service';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { Job } from 'bull';

interface FormCharacterUpdateResult {
  deleted: number;
  failed: number;
  success: number;
}

@Processor('form-character')
export class FormCharacterQueue {
  private readonly logger: Logger = new Logger(FormCharacterQueue.name);

  constructor(
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
      characters.map(async character => {
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
          this.formCharacterService.delete(character.id);
        } else {
          try {
            const formCharacter = await this.formCharacterService.create(findCharacterDto);
            await this.formCharacterService.update(character.id, formCharacter);
            success++;
          } catch (error) {
            this.logger.error('Error updating form character: ' + error);
            failed++;
          }
        }
      }),
    );

    return Promise.resolve({ success, deleted, failed });
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
