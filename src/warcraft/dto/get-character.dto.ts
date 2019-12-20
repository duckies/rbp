import { IsNotEmpty } from 'class-validator';
import { RealmName, RealmSlug } from '../interfaces/realm.enum';
import { Region } from '../interfaces/region.enum';
import { IsInEnums } from '../validators/blizzard-realm.validator';

export class CharacterLookupDto {
  constructor(name: string, realm?: RealmSlug, region?: Region) {
    this.name = name;
    this.realm = realm || RealmSlug.Blackrock;
    this.region = region || Region.US;
  }

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsInEnums([RealmName, RealmSlug], { message: '$value is not a valid realm name or realm slug.' })
  readonly realm: RealmName | RealmSlug;

  @IsNotEmpty()
  readonly region: Region;
}
