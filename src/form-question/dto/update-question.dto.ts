import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { FileTypes } from '../enums/file-types.enum';

export class UpdateQuestionDto {
  // Required for validation logic.
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  hint?: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsOptional()
  @IsString({ each: true })
  choices?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  multiple?: number;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(FileTypes, { each: true })
  fileTypes?: FileTypes[];
}
