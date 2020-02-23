import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FormCharacter } from '../form-character/form-character.entity';
import { Form } from '../form/form.entity';
import { User } from '../user/user.entity';
import { Answers } from './dto';
import { FormSubmissionStatus } from './enums/form-submission-status.enum';
import { FormSubmissionRead } from '../form-submission-seen/form-submission-read.entity';

@Entity()
export class FormSubmission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'enum', enum: FormSubmissionStatus, default: FormSubmissionStatus.Open })
  status: FormSubmissionStatus;

  @Column({ type: 'jsonb' })
  answers: Answers;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  formId: number;

  /**
   * Relations
   */

  @ManyToOne(
    () => Form,
    form => form.submissions,
    { onDelete: 'CASCADE' },
  )
  form: Form;

  @OneToMany(
    () => FormCharacter,
    formCharacter => formCharacter.submission,
    { eager: true, cascade: true },
  )
  characters: FormCharacter[];

  @Column()
  authorId: number;

  @ManyToOne(
    () => User,
    user => user.formSubmissions,
    { eager: true, cascade: true },
  )
  author: User;

  /**
   * "Seen" Relations
   */

  @OneToMany(
    () => FormSubmissionRead,
    formSubmissionRead => formSubmissionRead.formSubmission,
  )
  @JoinTable()
  readFormSubmissions: FormSubmissionRead[];

  /**
   * Just Submitted.
   * Not persisted, instructs the frontend the submission is new.
   */
  justSubmitted?: boolean;

  // Used as a constructed select in findAll.
  // Or would be if TypeORM supported them.
  seen?: boolean;

  @AfterLoad()
  setSeen(): void {
    this.seen = !!(this.readFormSubmissions && this.readFormSubmissions.length);
  }
}
