import { Realm as RealmSlug } from '../../enums/realm.enum';

export interface Links {
  self: Link;
}

export interface Link {
  href: string;
}

export interface GenderedString {
  male: string;
  female: string;
}

export interface Asset {
  key: string;
  value: string;
  file_data_id: number;
}

export interface Key {
  key: Link;
}

export interface KeyId {
  key: Link;
  id: number;
}

export interface KeyNameId {
  key: Link;
  name: string;
  id: number;
}

export interface Enum {
  type: string;
  name: string;
}

export interface Character {
  key: Link;
  name: string;
  id: number;
  realm: Realm;
}

export interface Guild {
  key: Link;
  name: string;
  id: number;
  realm: Realm;
  faction: Enum;
}

export interface Realm {
  key: Link;
  name: string;
  id: number;
  slug: RealmSlug;
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Faction {
  type: string;
  name: string;
}
