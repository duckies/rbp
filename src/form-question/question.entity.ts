import { Entity, Enum, ManyToOne, PrimaryKey, Property } from 'mikro-orm';
import { v4 } from 'uuid';
import { EnumArray } from '../../config/types/enum-array.type';
import { Form } from '../form/form.entity';
import { FieldType } from './enums/field-type.enum';
import { FileTypes } from './enums/file-types.enum';

@Entity()
export class FormQuestion {
  @PrimaryKey()
  id = v4();

  @Property()
  question!: string;

  @Property()
  label?: string;

  @Property()
  hint?: string;

  @Property()
  required!: boolean;

  @Property()
  choices?: string[];

  @Property()
  multiple?: number;

  @Property()
  order!: number;

  @Enum(() => FieldType)
  type!: FieldType;

  @Property({ type: EnumArray })
  fileTypes?: FileTypes[];

  @Property()
  deleted = false;

  @Property()
  hasAnswers = false;

  @Property({ persist: false })
  form_id: number;

  @ManyToOne()
  form!: Form;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
