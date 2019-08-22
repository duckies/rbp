import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { FieldType } from '../field.entity';

export class CreateFieldDto {
  @IsNotEmpty()
  order: number;

  @IsNotEmpty()
  @IsEnum(FieldType)
  type: FieldType;

  @IsNotEmpty()
  question: string;

  @IsOptional()
  hint?: string;

  @IsNotEmpty()
  isRequired: boolean;
}