import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested, IsDefined } from 'class-validator';
import { FindCharacterDto } from '../../blizzard/dto/find-character.dto';

export interface Answers {
  [id: string]: string | string[];
}

export class CreateFormSubmissionDto {
  @IsNumber()
  formId: number;

  @IsNotEmpty()
  answers: Answers;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FindCharacterDto)
  characters: FindCharacterDto[];
}
