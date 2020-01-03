import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FormQuestion } from '../form-question/question.entity';
import { FormSubmission } from '../form-submission/form-submission.entity';

@Entity('form')
export class Form extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => FormQuestion, question => question.form, { eager: true })
  questions: FormQuestion[];

  @OneToMany(() => FormSubmission, submission => submission.form)
  submissions: FormSubmission[];

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  lastUpdated: Date;
}
