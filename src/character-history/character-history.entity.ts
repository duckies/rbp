import {
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import * as ProfileAPI from '../blizzard/interfaces/profile';
import { AchievementsEntity } from '../blizzard/interfaces/profile/character-achievements/character-achievements-summary.interface';
import { GuildCharacter } from '../guild-character/character.entity';
import { CharacterSnapshot } from './interfaces/history.interface';

@Entity()
export class CharacterHistory {
  @PrimaryKey()
  reset: Date;

  @ManyToOne({ entity: () => GuildCharacter, primary: true })
  character!: GuildCharacter;

  [PrimaryKeyType]: [Date, number];

  @Property({ default: 0 })
  worldQuests: number = 0;

  @Property({ default: 0 })
  quests: number = 0;

  @Property({ default: 0 })
  dailies: number = 0;

  @Property({ default: 0 })
  dungeons: number = 0;

  @Property({ default: 0 })
  keystones: number = 0;

  @Property()
  snapshot: CharacterSnapshot = {
    quests: 0,
    worldQuests: 0,
    dailies: 0,
    dungeons: 0,
    keystones: 0,
  };

  setGuildCharacterHistoryAchievements(
    data: ProfileAPI.CharacterAchievementsSummary,
  ) {
    const achievements = new Map<number, AchievementsEntity>();

    for (const achievement of data.achievements) {
      achievements.set(achievement.id, achievement);
    }

    const quests = achievements.get(508);
    const worldQuests = achievements.get(11132);
    const dailies = achievements.get(977);

    if (quests) {
      if (this.snapshot.quests === 0) {
        this.snapshot.quests = quests.criteria.child_criteria[0].amount;
      }

      this.quests = quests.criteria.child_criteria[0].amount;
    }

    if (worldQuests) {
      if (this.snapshot.worldQuests === 0) {
        this.snapshot.worldQuests =
          worldQuests.criteria.child_criteria[0].amount;
      }

      this.worldQuests = worldQuests.criteria.child_criteria[0].amount;
    }

    if (dailies) {
      if (this.snapshot.dailies === 0) {
        this.snapshot.dailies = dailies.criteria.child_criteria[0].amount;
      }

      this.dailies = dailies.criteria.child_criteria[0].amount;
    }
  }
}
