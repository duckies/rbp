<<<<<<< HEAD
import { Links } from '../blizzard-shared.interface';
=======
import { Links } from '../profile/shared-profile.interface';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

export interface GameDataItemMedia {
  _links: Links;
  assets: Asset[];
}

export interface Asset {
  key: string; // This should be an enum in the future.
  value: string;
}
