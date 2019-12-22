import { Link, Links, Realm, RGBA, Faction } from './blizzard-shared.interface';

export interface ProfileGuild {
  _links: Links;
  id: number;
  name: string;
  faction: Faction;
  achievement_points: number;
  member_count: number;
  realm: Realm;
  crest: Crest;
  roster: Link;
  achievements: Link;
  created_timestamp: number;
}

export interface Crest {
  emblem: Border;
  border: Border;
  background: Background;
}

export interface Background {
  color: Color;
}

export interface Color {
  id: number;
  rgba: RGBA;
}

export interface Border {
  id: number;
  media: Media;
  color: Color;
}

export interface Media {
  key: Link;
}

