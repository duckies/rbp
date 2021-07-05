import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class CreateRaidNightDTO {
  @Type(() => Date)
  @IsDate()
  readonly start!: Date;

  @Type(() => Date)
  @IsDate()
  readonly end!: Date;

  @IsOptional()
  @IsBoolean()
  readonly optional?: boolean;
}
