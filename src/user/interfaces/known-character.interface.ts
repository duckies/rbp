import { RealmName } from '../../warcraft/interfaces/realm.enum';

export default class KnownCharacter {
  name: string;
  realm: RealmName;
  region: string;
  class: number;
  race: number;
  gender: number;
  level: number;
  thumbnail: string;
  lastModified: number;
}
