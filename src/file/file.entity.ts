import { Entity, ManyToOne, PrimaryKey, Property } from 'mikro-orm';
import { FormSubmission } from '../form-submission/form-submission.entity';
import { User } from '../user/user.entity';

@Entity()
export class FileUpload {
  @PrimaryKey()
  id!: number;

  @Property()
  filename!: string;

  @Property()
  path!: string;

  @Property()
  mimetype!: string;

  @Property()
  size!: number;

  @Property()
  immune = false;

  @ManyToOne()
  author: User;

  @ManyToOne()
  submission?: FormSubmission;
}
