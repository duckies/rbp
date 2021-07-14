import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { CharacterHistory } from '../guild-character-history/character-history.entity';
import { RaidIdentity } from '../raid-identity/raid-identity.entity';
import { Character } from './character.base.entity';
import { TorghastWings } from './interfaces/torghast-wings.interface';

@Entity()
export class GuildCharacter extends Character {
  @Property({ type: 'smallint' })
  guild_rank!: number;

  @Property({ type: 'smallint', default: 0 })
  cutting_edge: number = 0;

  @Property({ type: 'smallint', default: 0 })
  ahead_of_the_curve: number = 0;

  @Property({ type: 'smallint', default: 0 })
  torghast_floors: number = 0;

  @Property({ nullable: true })
  torghast_wings: TorghastWings = {
    skoldus_hall: 0,
    fracture_chambers: 0,
    soulforges: 0,
    coldheart_interstitia: 0,
    mortregar: 0,
    upper_reaches: 0,
  };

  @Property({ type: 'smallint', default: 0 })
  twisting_corridors: number = 0;

  @OneToMany(() => CharacterHistory, (h) => h.character)
  history = new Collection<CharacterHistory>(this);

  @OneToOne(() => RaidIdentity, 'character', { nullable: true })
  identity?: RaidIdentity;

  // setCharacterAchievements(data: ProfileAPI.CharacterAchievementsSummary) {
  //   const achievements = new Map<number, AchievementsEntity>();

  //   for (const achievement of data.achievements) {
  //     achievements.set(achievement.id, achievement);
  //   }

  //   this.cutting_edge = CUTTING_EDGE_ACHIEVEMENTS.filter((e) =>
  //     achievements.has(e),
  //   ).length;

  //   this.ahead_of_the_curve = AHEAD_OF_THE_CURVE_ACHIEVEMENTS.filter((a) =>
  //     achievements.has(a),
  //   ).length;

  //   let torghastLayers = 0;
  //   for (const wing of achievements.get(14810).criteria.child_criteria) {
  //     this.torghast_wings[TORGHAST_WINGS[wing.id]] = wing.amount / 6;
  //     torghastLayers += wing.amount / 7;
  //   }

  //   this.twisting_corridors = TORGHAST_TWISTING_CORRIDORS_IDS.filter((a) =>
  //     achievements.has(a),
  //   ).length;

  //   this.torghast_floors = torghastLayers + this.twisting_corridors;
  // }

  // setCharacterAchievementStatistics(data: ProfileAPI.CharacterAchievementStatistics) {
  //   const dungeonsAndRaids = data.categories.find((c) => c.id === 14807);

  //   dungeonsAndRaids.sub_categories.map((category) => )
  // }

  // setCharacterRaids(data: ProfileAPI.CharacterRaids) {
  //   const dungeonsAndRaids = data.
  // }
}
