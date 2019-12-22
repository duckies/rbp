import { Link, Links, Realm } from './blizzard-shared.interface';
import { AchievementOrCategory, Criteria } from './profile-achievements.interface';

export interface ProfileGuildAchievements {
  _links: Links;
  guild: AchievementOrCategory;
  total_quantity: number;
  total_points: number;
  achievements: Achievement[];
  category_progress: CategoryProgress[];
  recent_events: RecentEvent[];
}

export interface AchievementsGuild {
  key: Link;
  name: string;
  id: number;
  realm: Realm;
}

export interface Achievement {
  id: number;
  achievement: AchievementOrCategory;
  criteria?: Criteria;
  completed_timestamp?: number;
}

export interface CategoryProgress {
  category: AchievementOrCategory;
  quantity: number;
  points: number;
}

export interface RecentEvent {
  achievement: AchievementOrCategory;
  timestamp: number;
}
