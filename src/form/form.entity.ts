import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../question/question.entity';
import { Submission } from '../submission/submission.entity';

@Entity('form')
export class Form extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Question, question => question.form, { eager: true })
  questions: Question[];

  @OneToMany(() => Submission, submission => submission.form)
  submissions: Submission[];

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  lastUpdated: Date;
}
