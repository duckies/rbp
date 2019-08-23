import { RealmName } from './realm.enum';
import { CharacterResponse } from './character-response.interface';

export interface Member {
  character: CharacterResponse;
  rank: number;
}

export default interface GuildResponse {
  lastModified: number;
  name: string;
  realm: RealmName;
  battlegroup: string;
  level: number;
  side: number;
  achievementPoints: number;
  members: Member[];
}
