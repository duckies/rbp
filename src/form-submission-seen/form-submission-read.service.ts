import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormSubmissionRead } from './form-submission-read.entity';

@Injectable()
export class FormSubmissionReadService {
  constructor(@InjectRepository(FormSubmissionRead) private readonly repository: Repository<FormSubmissionRead>) {}

  /**
   * Creates a new FormSubmissionRead jointable entity, does nothing on conflict.
   * @param formSubmissionId FormSubmission.id
   * @param userId User.id
   */
  async create(formSubmissionId: number, userId: number) {
    return this.repository.save({ userId, formSubmissionId });
  }

  /**
   * Finds one FormSubmissionRead entity or fails.
   * @param id FormSubmissionRead.id
   */
  async findOne(id: number): Promise<FormSubmissionRead> {
    return this.repository.findOneOrFail(id);
  }

  /**
   * Deletes a FormSubmissionRead entity.
   * @param id FormSubmissionRead.id
   */
  async delete(id: number, userId: number) {
    const formSubmissionRead = await this.repository.findOneOrFail(id, { relations: ['user'] });

    if (formSubmissionRead.user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.repository.delete(formSubmissionRead);
  }
}
