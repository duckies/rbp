import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export enum FieldType {
  TEXTINPUT = 'TextInput',
  TEXTAREA = 'TextArea',
  CHECKBOX = 'Checkbox',
  DIALOG = 'Dialog',
  UPLOAD = 'Upload'
}

@Entity('field')
export class Field extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  order: number;

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column()
  question: string;

  @Column({ nullable: true })
  hint?: string;

  @Column()
  isRequired: boolean;

  // This is not saved in the database, but can be received through the frontend.
  answer: string;
}