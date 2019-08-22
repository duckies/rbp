import { IsEnum, IsOptional } from 'class-validator';
import { FieldType } from '../field.entity';

export class UpdateFieldDto {
  @IsOptional()
  order: number;

  @IsOptional()
  @IsEnum(FieldType)
  type: FieldType;

  @IsOptional()
  question: string;

  @IsOptional()
  hint?: string;

  @IsOptional()
  isRequired: boolean;
}