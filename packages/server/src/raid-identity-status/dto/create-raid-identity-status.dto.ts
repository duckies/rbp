import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FindRaidIdentityDto } from '../../raid-identity/dto/find-raid-identity.dto';
import { IdentityStatus } from '../enums/character-status.enum';

export class CreateRaidIdentityStatusDto {
  @IsEnum(IdentityStatus)
  readonly status!: IdentityStatus;

  @IsNumber()
  readonly points!: number;

  @IsOptional()
  @IsString()
  readonly note?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => FindRaidIdentityDto)
  readonly identity!: FindRaidIdentityDto;
}
