import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Form } from '../form/form.entity';

export enum FieldType {
  TEXTINPUT = 'TextInput',
  TEXTAREA = 'TextArea',
  CHECKBOX = 'Checkbox',
  SELECT = 'Select',
  RADIO = 'Radio',
  UPLOAD = 'Upload',
}

export const choicesFields = [FieldType.CHECKBOX, FieldType.SELECT, FieldType.RADIO];
export const multipleFields = [FieldType.CHECKBOX, FieldType.SELECT, FieldType.UPLOAD];

export enum FileTypes {
  Image = 'image/*',
}

@Entity('form_question')
export class FormQuestion extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column({ nullable: true })
  label?: string;

  @Column({ nullable: true })
  hint?: string;

  @Column()
  required: boolean;

  @Column('text', { nullable: true, array: true })
  choices: string[];

  @Column({ nullable: true })
  multiple: number;

  @Column()
  order: number;

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column({ type: 'enum', enum: FileTypes, nullable: true, array: true })
  fileTypes: FileTypes[];

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  hasAnswers: boolean;

  @Column()
  formId: number;

  @ManyToOne(() => Form, form => form.questions, { onDelete: 'CASCADE' })
  form: Form;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
