import { Links, Link } from '../blizzard-shared.interface';
import { Character } from '../../../character/character.entity';

export interface ProfileReputations {
  _links: Links;
  character: Character;
  reputations: Reputation[];
}

export interface Reputation {
  faction: Faction;
  standing: Standing;
  paragon?: Paragon;
}

export interface Faction {
  key: Link;
  name: string;
  id: number;
}

export interface Paragon {
  raw: number;
  value: number;
  max: number;
}

export interface Standing {
  raw: number;
  value: number;
  max: number;
  tier: number;
  name: string; // Could be enum, do not have full list.
}
