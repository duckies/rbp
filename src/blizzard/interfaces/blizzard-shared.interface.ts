import { RealmSlug } from '../enum/realm.enum';

export interface Links {
  self: Link;
}

export interface Link {
  href: string;
}

export interface Character {
  key: Link;
  name: string;
  id: number;
  realm: Realm;
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
