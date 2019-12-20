import { IsEnum, IsString } from 'class-validator';
import { RealmSlug } from '../../interfaces/realm.enum';
import { Region } from '../../interfaces/region.enum';

export class FindCharacterDto {
  @IsString()
  readonly name: string;

  @IsEnum(RealmSlug, { message: '$value is not a valid realm slug.' })
  readonly realm: RealmSlug;

  @IsEnum(Region)
  readonly region: Region;
}
