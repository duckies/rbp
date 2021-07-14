import { IsEnum, IsString } from 'class-validator';
import { RealmSlug, Realm } from '../enums/realm.enum';
import { Region } from '../enums/region.enum';

export class FindCharacterDto {
  @IsString()
  readonly name: string;

  @IsEnum(RealmSlug, { message: '$value is not a valid realm slug' })
  readonly realm: Realm;

  @IsEnum(Region, { message: '$value is not a valid region' })
  readonly region: Region = Region.US;

  constructor(
    name: string,
    realm: Realm = RealmSlug.Area52,
    region: Region = Region.US,
  ) {
    this.name = name;
    this.realm = realm;
    this.region = region;
  }
}
