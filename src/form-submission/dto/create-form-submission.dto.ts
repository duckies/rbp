import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { FindCharacterDto } from '../../blizzard/dto/find-character.dto';

export interface Answers {
  [id: string]: string | string[];
}

export class CreateFormSubmissionDto {
  @IsNumber()
  formId: number;

  @IsNotEmpty()
  answers: Answers;

  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  files?: number[];

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FindCharacterDto)
  characters: FindCharacterDto[];
}
