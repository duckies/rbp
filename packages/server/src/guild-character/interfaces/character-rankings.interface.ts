import { ZoneRankings } from '../../warcraftlogs/interfaces/zone-rankings.interface';

type Role = 'DPS' | 'Tank' | 'Healer';

export type CharacterRankings = {
  [role in Role]?: ZoneRankings;
};
