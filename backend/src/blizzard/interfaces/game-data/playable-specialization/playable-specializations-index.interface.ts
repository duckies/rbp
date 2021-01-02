import { KeyNameId, Links } from '../../profile';

export interface PlayableSpecializationsIndex {
  _links: Links;
  character_specializations: KeyNameId[];
  pet_specializations: KeyNameId[];
}
