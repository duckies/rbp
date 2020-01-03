import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { FormSubmission } from '../form-submission/form-submission.entity';

/**
 * Existence of this entity marks a form submission as seen for the user.
 */

@Entity('form_submission_read')
@Index('idx_user_form_read', ['userId', 'formSubmissionId'], { unique: true })
export class FormSubmissionRead extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  formSubmissionId: number;

  @ManyToOne(
    () => User,
    user => user.readFormSubmissions,
  )
  user: User;

  @ManyToOne(
    () => FormSubmission,
    formSubmissionRead => formSubmissionRead.readFormSubmissions,
  )
  formSubmission: FormSubmission;
}
