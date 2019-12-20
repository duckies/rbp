import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { File } from '../file/file.entity';
import { Form } from '../form/form.entity';
import { Answers } from './dto';

@Entity()
export class Submission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  answers: Answers;

  @OneToMany(() => File, file => file.submission)
  files: File[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  formId: number;

  @ManyToOne(() => Form, form => form.submissions, { onDelete: 'CASCADE' })
  form: Form;
}
