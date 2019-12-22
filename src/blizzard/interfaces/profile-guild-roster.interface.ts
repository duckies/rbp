import { Link, Links, Realm } from './blizzard-shared.interface';

export interface ProfileGuildRoster {
  _links: Links;
  guild: Guild;
  members: Member[];
}

export interface Guild {
  key: Link;
  name: string;
  id: number;
  realm: Realm;
}

export interface Member {
  character: RosterCharacter;
  rank: number;
}

export interface RosterCharacter {
  name: string;
  id: number;
  realm: Realm;
  level: number;
  playable_class: Playable;
  playable_race: Playable;
}

export interface Playable {
  key: Link;
  id: number;
}
