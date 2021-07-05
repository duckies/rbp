import { IsEnum, IsString } from 'class-validator';
import { RealmSlug } from '../../blizzard/enums/realm.enum';
import { Region } from '../../blizzard/enums/region.enum';

export class FindRaidIdentityDTO {
  @IsString()
  readonly name!: string;

  @IsEnum(RealmSlug)
  readonly realm!: RealmSlug;

  @IsEnum(Region)
  readonly region!: Region;
}
