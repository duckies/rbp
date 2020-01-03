import { Character } from '../../../character/character.entity';
import { Link, Links } from '../blizzard-shared.interface';

export interface ProfileKeystoneIndex {
  _links: Links;
  current_period: CurrentSeason;
  seasons: KeystoneSeason[];
  character: Character;
}

export interface CurrentSeason {
  period: KeystoneSeason;
}

export interface KeystoneSeason {
  key: Link;
  id: number;
}
