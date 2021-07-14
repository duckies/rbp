import { IsEnum, IsString } from 'class-validator';
import { RealmSlug, Realm } from '../enums/realm.enum';
import { Region } from '../enums/region.enum';

export class FindGuildDto {
  @IsString()
  name: string;

  @IsEnum(RealmSlug, { message: '$value is not a valid realm slug' })
  readonly realm: Realm;

  @IsEnum(Region, { message: '$value is not a valid region' })
  readonly region: Region = Region.US;
}
