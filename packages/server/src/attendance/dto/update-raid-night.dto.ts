import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdateRaidNightDTO {
  @IsOptional()
  @IsDate()
  readonly start!: Date;

  @IsOptional()
  @IsDate()
  readonly end!: Date;

  @IsOptional()
  @IsBoolean()
  readonly optional?: boolean;
}
