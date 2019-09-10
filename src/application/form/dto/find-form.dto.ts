import { IsOptional, IsEnum } from 'class-validator';
import { FormStatus } from '../form-status.enum';

export class FindFormDto {
  @IsOptional()
  @IsEnum(FormStatus)
  
  status: FormStatus
}