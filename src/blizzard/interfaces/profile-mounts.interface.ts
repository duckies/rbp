import { Link, Links } from './blizzard-shared.interface';

export interface ProfileMountCollection {
  _links: Links;
  mounts?: MountsEntity[] | null;
}

export interface MountsEntity {
  mount: Mount;
  is_favorite?: boolean | null;
}

export interface Mount {
  key: Link;
  name: string;
  id: number;
}
