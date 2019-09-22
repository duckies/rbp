import { IsNotEmpty, IsEnum, IsOptional, IsPositive } from 'class-validator';
import { FieldType } from '../field.entity';

export class CreateFieldDto {
  @IsNotEmpty()
  @IsPositive()
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
