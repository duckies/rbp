import { Character, Link, Links } from '../blizzard-shared.interface';

export interface ProfileStatistics {
  _links: Links;
  health: number;
  power: number;
  power_type: PowerType;
  speed: Avoidance;
  strength: BaseStat;
  agility: BaseStat;
  intellect: BaseStat;
  stamina: BaseStat;
  melee_crit: Rating;
  melee_haste: Rating;
  mastery: Rating;
  bonus_armor: number;
  lifesteal: Block;
  versatility: number;
  versatility_damage_done_bonus: number;
  versatility_healing_done_bonus: number;
  versatility_damage_taken_bonus: number;
  avoidance: Avoidance;
  attack_power: number;
  main_hand_damage_min: number;
  main_hand_damage_max: number;
  main_hand_speed: number;
  main_hand_dps: number;
  off_hand_damage_min: number;
  off_hand_damage_max: number;
  off_hand_speed: number;
  off_hand_dps: number;
  spell_power: number;
  spell_penetration: number;
  spell_crit: Rating;
  mana_regen: number;
  mana_regen_combat: number;
  armor: BaseStat;
  dodge: Rating;
  parry: Rating;
  block: Rating;
  ranged_crit: Rating;
  ranged_haste: Rating;
  spell_haste: Rating;
  character: Character;
}

export interface BaseStat {
  base: number;
  effective: number;
}

export interface Avoidance {
  rating: number;
  rating_bonus: number;
}

export interface Block {
  rating: number;
  rating_bonus: number;
  value: number;
}

export interface Rating {
  rating: number;
  rating_bonus: number;
  value: number;
}

export interface PowerType {
  key: Link;
  name: string;
  id: number;
}
