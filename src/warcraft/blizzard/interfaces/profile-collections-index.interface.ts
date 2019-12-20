import { Links, Link } from './blizzard-shared.interface';

export interface ProfileCollectionsIndex {
  _links: Links;
  pets: Link;
  mounts: Link;
}
