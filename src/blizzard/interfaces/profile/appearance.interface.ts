import { Character, Link, Links } from '../blizzard-shared.interface';
import { Crest } from '../profile-guild.interface';
import { Specialization } from '../profile-specializations.interface';

export interface ProfileAppearance {
  _links: Links;
  character: Character;
  playable_race: Race;
  playable_class: Class;
  active_spec: Specialization;
  gender: Gender;
  faction: Faction;
  guild_crest: Crest;
  appearance: Appearance;
  items: Item[];
}

export interface Race {
  key: Link;
  name: string;
  id: number;
}

export interface Class {
  key: Link;
  name: string;
  id: number;
}

export interface Gender {
  type: string;
  name: string;
}

export interface Faction {
  type: string;
  name: string;
}

export interface ActiveSpec {
  key: Link;
  name: string;
  id: number;
}

export interface Appearance {
  face_variation: number;
  skin_color: number;
  hair_variation: number;
  hair_color: number;
  feature_variation: number;
  custom_display_options: number[];
}

export interface Media {
  key: Link;
}

export interface Item {
  id: number;
  slot: ItemSlot;
  enchant: number;
  item_appearance_modifier_id: number;
  internal_slot_id: number;
  subclass: number;
}

export interface ItemSlot {
  type: string;
  name: string;
}