import { IsEnum, IsString } from 'class-validator';
import { RealmSlug } from '../enum/realm.enum';
import { Region } from '../enum/region.enum';

export class FindCharacterDto {
  @IsString()
  readonly name: string;

  @IsEnum(RealmSlug, { message: '$value is not a valid realm slug.' })
  readonly realm: RealmSlug;

  @IsEnum(Region)
  readonly region: Region = Region.US;

  constructor(name: string, realm: RealmSlug = RealmSlug.Area52, region: Region = Region.US) {
    this.name = name;
    this.realm = realm;
    this.region = region;
  }
}
