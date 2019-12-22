import { IsEnum, IsString } from 'class-validator';
import { RealmSlug } from '../enum/realm.enum';
import { Region } from '../enum/region.enum';

export class FindGuildDto {
  @IsString()
  name: string;

  @IsEnum(RealmSlug)
  realm: RealmSlug;

  @IsEnum(Region)
  region: Region;
}
