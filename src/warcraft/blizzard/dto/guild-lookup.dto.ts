import { IsNotEmpty } from 'class-validator';
import { RealmSlug } from '../../interfaces/realm.interface';

export class GuildLookupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  realm: RealmSlug;

  @IsNotEmpty()
  region: string;
}