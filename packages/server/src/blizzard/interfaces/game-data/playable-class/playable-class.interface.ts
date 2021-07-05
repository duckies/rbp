import { GenderedString, KeyId, KeyNameId, Link, Links } from '../../profile';

export interface PlayableClass {
  _links: Links;
  id: number;
  name: string;
  gender_name: GenderedString;
  power_type: KeyNameId;
  specializations: KeyNameId[];
  media: KeyId;
  pvp_talent_slots: Link;
}
