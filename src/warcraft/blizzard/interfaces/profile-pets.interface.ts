import { Links, Link } from './blizzard-shared.interface';

export interface ProfilePetCollection {
  _links: Links;
  pets?: PetsEntity[] | null;
  unlocked_battle_pet_slots: number;
}

export interface PetsEntity {
  species: Species;
  level: number;
  quality: Quality;
  stats: Stats;
  creature_display?: CreatureDisplay | null;
  id: number;
  is_favorite?: boolean | null;
  name?: string | null;
}
export interface Species {
  key: Link;
  name: string;
  id: number;
}
export interface Quality {
  type: string;
  name: string;
}
export interface Stats {
  breed_id: number;
  health: number;
  power: number;
  speed: number;
}
export interface CreatureDisplay {
  key: Link;
}
