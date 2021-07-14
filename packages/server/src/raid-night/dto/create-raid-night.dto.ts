import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateRaidNightDto {
  @Type(() => Date)
  @IsDate()
  readonly start!: Date;

  @Type(() => Date)
  @IsDate()
  readonly end!: Date;

  @IsString()
  readonly zone?: string;

  @IsOptional()
  @IsBoolean()
  readonly optional?: boolean;
}
