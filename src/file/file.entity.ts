import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FormSubmission } from '../form-submission/form-submission.entity';
import { User } from '../user/user.entity';

@Entity()
export class FileUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column({ default: false })
  immune: boolean;

  @ManyToOne(
    () => User,
    user => user.files,
    { eager: true, cascade: true },
  )
  author: User;

  @ManyToOne(
    () => FormSubmission,
    submission => submission.files,
  )
  submission: FormSubmission;
}
