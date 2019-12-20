import { IsNotEmpty, IsNumber } from 'class-validator';

export interface Answers {
  [id: string]: string | string[];
}

export class CreateSubmissionDto {
  @IsNumber()
  formId: number;

  @IsNotEmpty()
  answers: Answers;
}
