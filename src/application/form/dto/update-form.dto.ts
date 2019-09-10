import { FormStatus } from '../form-status.enum';
import { IsOptional, IsEnum } from 'class-validator';
import { Field } from '../../field/field.entity';

export class UpdateFormDto {
  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;

  @IsOptional()
  fields: Field[];
}