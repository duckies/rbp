import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class PutSeenFormSubmissionDto {
  @Type(() => Boolean)
  @IsBoolean()
  seen: boolean;
}
