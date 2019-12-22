import { Links } from './blizzard-shared.interface';

export interface ProfileStatus {
  _links: Links;
  id: number;
  is_valid: boolean;
}

