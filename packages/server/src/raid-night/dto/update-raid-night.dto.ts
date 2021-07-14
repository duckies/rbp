import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateRaidNightDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly start!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly end!: Date;

  @IsOptional()
  @IsString()
  readonly zone?: string;

  @IsOptional()
  @IsBoolean()
  readonly optional?: boolean;
}
