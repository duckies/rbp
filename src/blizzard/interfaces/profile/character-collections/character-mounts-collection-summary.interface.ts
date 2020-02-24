import { Link, Links } from '../shared-profile.interface';

export interface CharacterMountsCollectionSummary {
  _links: Links;
  mounts: Mount[];
  is_favorite?: boolean;
}

export interface Mount {
  key: Link;
  name: string;
  id: number;
}
