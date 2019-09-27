import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Generated } from 'typeorm';
import { FieldOptions } from './dto/update-field.dto';

export enum FieldType {
  TEXTINPUT = 'TextInput',
  TEXTAREA = 'TextArea',
  CHECKBOX = 'Checkbox',
  SELECT = 'Select',
  UPLOAD = 'Upload',
}

@Entity('field')
export class Field extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true })
  order: number;

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column()
  question: string;

  @Column({ nullable: true })
  label?: string;

  @Column({ nullable: true })
  hint?: string;

  @Column()
  isRequired: boolean;

  @Column({ nullable: true, type: 'jsonb' })
  options: FieldOptions;

  // This is not saved in the database, but can be received through the frontend.
  answer: string;
}
