import { Asset, Character, Links } from '../shared-profile.interface';

export interface CharacterMediaSummary {
  _links: Links;
  character: Character;
  assets: Omit<Asset, 'file_data_id'>[];
}
