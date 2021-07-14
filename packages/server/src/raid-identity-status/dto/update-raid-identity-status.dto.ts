import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { IdentityStatus } from '../enums/character-status.enum';

export class UpdateRaidIdentityStatusDto {
  @IsOptional()
  @IsEnum(IdentityStatus)
  readonly status?: IdentityStatus;

  @IsOptional()
  @IsNumber()
  readonly points?: number;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
