import { Asset, Links } from '../../profile';

export interface PlayableSpecializationMedia {
  _links: Links;
  assets: Asset[];
  id: number;
}
