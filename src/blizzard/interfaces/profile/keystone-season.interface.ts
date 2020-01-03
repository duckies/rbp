import { Character, Link, Links } from '../blizzard-shared.interface';
import { Specialization } from '../profile-specializations.interface';
import { KeystoneSeason } from './keystone-index.interface';

export interface ProfileKeystoneSeason {
  _links: Links;
  season: KeystoneSeason;
  best_runs: BestRun[];
  character: Character;
}

export interface BestRun {
  completed_timestamp: number;
  duration: number;
  keystone_level: number;
  keystone_affixes: Affix[];
  members: Member[];
  dungeon: Dungeon;
  is_completed_within_time: boolean;
}

export interface Affix {
  key: Link;
  name: string;
  id: number;
}

export interface Member {
  character: Omit<Character, 'key'>;
  specialization: Specialization;
  race: Race; // TODO: Replace when data apis are added.
  equipped_item_level: number;
}

export interface Race {
  key: Link;
  name: string;
  id: number;
}

export interface Dungeon {
  key: Link;
  name: string;
  id: number;
}
