import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { EnumArray } from '../../config/types/enum-array.type';
import { Form } from '../form/form.entity';
import { FieldType } from './enums/field-type.enum';
import { FileTypes } from './enums/file-types.enum';

@Entity()
export class FormQuestion {
  @PrimaryKey()
  id: string = v4();

  @Property()
  question!: string;

  @Property({ nullable: true })
  label?: string;

  @Property({ nullable: true })
  hint?: string;

  @Property()
  required!: boolean;

  @Property({ nullable: true })
  choices?: string[];

  @Property({ nullable: true })
  multiple?: number;

  @Property()
  order!: number;

  @Enum(() => FieldType)
  type!: FieldType;

  @Property({ type: EnumArray, nullable: true })
  fileTypes?: FileTypes[];

  @Property()
  deleted: boolean = false;

  @Property()
  hasAnswers: boolean = false;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Relationships
   */

  @ManyToOne(() => Form)
  form!: Form;
}
