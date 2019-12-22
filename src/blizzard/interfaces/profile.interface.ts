import { Faction, Link, Links, Realm } from './blizzard-shared.interface';

export interface ProfileCharacter {
  _links: Links;
  id: number;
  name: string;
  gender: Faction;
  faction: Faction;
  race: ActiveSpec;
  character_class: ActiveSpec;
  active_spec: ActiveSpec;
  realm: Realm;
  guild: ActiveSpec;
  level: number;
  experience: number;
  achievement_points: number;
  achievements: Link;
  titles: Link;
  pvp_summary: Link;
  raid_progression: Link;
  media: Link;
  last_login_timestamp: number;
  average_item_level: number;
  equipped_item_level: number;
  specializations: Link;
  statistics: Link;
  mythic_keystone_profile: Link;
  equipment: Link;
  appearance: Link;
  collections: Link;
  active_title?: ActiveSpec;
  reputations: Link;
  quests: Link;
}

export interface ActiveSpec {
  key: Link;
  name: string;
  id: number;
  display_string?: string;
  realm?: ActiveSpec;
  slug?: string;
}