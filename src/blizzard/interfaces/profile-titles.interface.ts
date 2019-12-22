import { Link, Links } from './blizzard-shared.interface';

export interface ProfileTitles {
  _links: Links;
  character: ActiveTitle;
  active_title: ActiveTitle;
  titles: ActiveTitle[];
}

export interface ActiveTitle {
  key: Link;
  name: string;
  id: number;
  display_string?: string;
  realm?: ActiveTitle;
  slug?: string;
}
