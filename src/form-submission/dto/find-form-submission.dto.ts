import { IsNumberString } from "class-validator";

export class FindFormSubmissionDto {
  @IsNumberString()
  id: number;
}