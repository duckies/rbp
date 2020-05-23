import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  WrappedEntity,
} from 'mikro-orm';
import { FileUpload } from '../file/file.entity';
import { FormCharacter } from '../form-character/form-character.entity';
import { Form } from '../form/form.entity';
import { User } from '../user/user.entity';
import { Answers } from './dto';
import { FormSubmissionStatus } from './enums/form-submission-status.enum';

@Entity()
export class FormSubmission {
  @PrimaryKey()
  id!: number;

  @Enum(() => FormSubmissionStatus)
  status = FormSubmissionStatus.Open;

  @Property({ type: 'jsonb' })
  answers: Answers;

  @Property({ persist: false })
  form_id!: number;

  @ManyToOne()
  form!: Form;

  @OneToMany(() => FormCharacter, (char) => char.submission, { cascade: [Cascade.ALL] })
  characters = new Collection<FormCharacter>(this);

  @Property({ persist: false })
  author_id!: number;

  @ManyToOne({ eager: true })
  author!: User;

  @OneToMany(() => FileUpload, (file) => file.submission, {
    eager: true,
    cascade: [Cascade.MERGE],
  })
  files = new Collection<FileUpload>(this);

  /**
   * Instructs the frontend the submission is new.
   */
  @Property({ persist: false })
  justSubmitted?: boolean;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FormSubmission extends WrappedEntity<FormSubmission, 'id'> {}
