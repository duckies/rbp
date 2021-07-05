import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RealmSlug } from '../../blizzard/enums/realm.enum';
import { Region } from '../../blizzard/enums/region.enum';
import { RaidRole } from '../interfaces/raid-role.enum';

export class CreateRaidIdentityDTO {
  @IsString()
  readonly name!: string;

  @IsEnum(RealmSlug)
  readonly realm!: RealmSlug;

  @IsEnum(Region)
  readonly region!: Region;

  @IsEnum(RaidRole)
  readonly role!: RaidRole;

  @IsOptional()
  @IsString()
  readonly discordTag?: string;

  @IsOptional()
  @IsNumber()
  readonly characterId?: number;
}
