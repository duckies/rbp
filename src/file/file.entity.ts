import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Submission } from '../submission/submission.entity';
import { User } from '../user/user.entity';

@Entity('file')
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  fieldname: string;

  @Column()
  size: number;

  @Column({ nullable: true })
  folder?: string;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  url?: string;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, user => user.files, { onDelete: 'SET NULL' })
  owner: User;

  @ManyToOne(() => User, user => user.files, { onDelete: 'SET NULL' })
  submission: Submission;
}
