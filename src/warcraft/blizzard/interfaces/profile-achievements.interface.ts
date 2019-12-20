import { Links, Link } from './blizzard-shared.interface';

export interface ProfileAchievements {
  _links: Links;
  total_quantity: number;
  total_points: number;
  achievements?: AchievementsEntity[] | null;
  category_progress?: CategoryProgressEntity[] | null;
  recent_events?: RecentEventsEntity[] | null;
  character: Character;
}

export interface AchievementsEntity {
  id: number;
  achievement: AchievementOrCategory;
  criteria?: Criteria | null;
  completed_timestamp?: number | null;
}

export interface AchievementOrCategory {
  key: Link;
  name: string;
  id: number;
}

export interface Criteria {
  id: number;
  is_completed: boolean;
  child_criteria?: ChildCriteriaEntity[] | null;
  amount?: number | null;
}

export interface ChildCriteriaEntity {
  id: number;
  amount?: number | null;
  is_completed: boolean;
  child_criteria?: CriteriaOrChildCriteriaEntity[] | null;
}

export interface CriteriaOrChildCriteriaEntity {
  id: number;
  is_completed: boolean;
  child_criteria?: ChildCriteriaEntity1[] | null;
  amount?: number | null;
}

export interface ChildCriteriaEntity1 {
  id: number;
  amount?: number | null;
  is_completed: boolean;
}

export interface CategoryProgressEntity {
  category: AchievementOrCategory;
  quantity: number;
  points: number;
}

export interface RecentEventsEntity {
  achievement: AchievementOrCategory;
  timestamp: number;
}

export interface Character {
  key: Link;
  name: string;
  id: number;
  realm: Realm;
}

export interface Realm {
  key: Link;
  name: string;
  id: number;
  slug: string;
}
