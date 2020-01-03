import { IsEnum, IsOptional } from "class-validator";
import { FormSubmissionStatus } from "../enums/form-submission-status.enum";
import { Answers } from "./create-form-submission.dto";

export class UpdateFormSubmissionDto {
  @IsOptional()
  @IsEnum(FormSubmissionStatus)
  status?: FormSubmissionStatus;

  @IsOptional()
  answers?: Answers;
}