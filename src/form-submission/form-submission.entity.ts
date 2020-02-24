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
<<<<<<< HEAD
import { File } from '../file/file.entity';
=======
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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

<<<<<<< HEAD
  @OneToMany(
    () => File,
    file => file.submission,
  )
  files: File[];

  @CreateDateColumn()
=======
  @CreateDateColumn({ type: 'timestamptz' })
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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

<<<<<<< HEAD
=======
  @Column()
  authorId: number;

>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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
<<<<<<< HEAD
  setSeen() {
=======
  setSeen(): void {
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
    this.seen = !!(this.readFormSubmissions && this.readFormSubmissions.length);
  }
}
