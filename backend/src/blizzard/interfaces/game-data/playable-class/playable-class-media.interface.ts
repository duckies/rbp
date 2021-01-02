import { Asset, Links } from '../../profile';

export interface PlayableClassMedia {
  _links: Links;
  id: number;
  assets: Asset[];
}
