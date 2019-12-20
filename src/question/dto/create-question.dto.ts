import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { FieldType, FileTypes } from '../question.entity';

export class CreateQuestionDto {
  @IsString()
  question: string;

  @IsNumber()
  formId: number;

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  hint?: string;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsString({ each: true })
  choices?: string[];

  @IsOptional()
  @Min(0)
  @Max(10)
  multiple?: number;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsArray()
  @IsEnum(FileTypes, { each: true })
  fileTypes?: FileTypes[];

  @IsEnum(FieldType)
  type: FieldType;
}
