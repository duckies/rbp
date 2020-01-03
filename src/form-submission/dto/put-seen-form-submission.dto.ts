import { IsBoolean, IsBooleanString } from 'class-validator';
import { Type } from 'class-transformer';

export class PutSeenFormSubmissionDto {
  @Type(() => Boolean)
  @IsBoolean()
  seen: boolean;
}
