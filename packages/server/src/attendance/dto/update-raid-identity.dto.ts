import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RealmSlug } from '../../blizzard/enums/realm.enum';
import { RaidRole } from '../interfaces/raid-role.enum';

export class UpdateRaidIdentityDTO {
  @IsOptional()
  @IsString()
  readonly name!: string;

  @IsOptional()
  @IsEnum(RealmSlug)
  readonly realm!: RealmSlug;

  @IsOptional()
  @IsEnum(RaidRole)
  readonly role!: RaidRole;

  @IsOptional()
  @IsString()
  readonly discordTag?: string;

  @IsOptional()
  @IsNumber()
  readonly characterId?: number;
}
