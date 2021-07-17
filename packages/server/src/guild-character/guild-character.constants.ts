import { FindGuildDto } from '../blizzard/dto/find-guild.dto';
import { RealmSlug } from '../blizzard/enums/realm.enum';
import { Region } from '../blizzard/enums/region.enum';

export const GUILD_DTO: FindGuildDto = {
  name: 'really-bad-players',
  realm: RealmSlug.Area52,
  region: Region.US,
};
