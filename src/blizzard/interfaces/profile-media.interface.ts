import { Links, Character } from './blizzard-shared.interface';

export interface ProfileMedia {
  _links: Links;
  character: Character;
  avatar_url: string;
  bust_url: string;
  render_url: string;
}

