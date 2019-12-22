import { Link, Links } from './blizzard-shared.interface';

export interface ProfileSpecializations {
  _links: Links;
  specializations: Specialization[];
  active_specialization: ActiveSpecialization;
  character: ActiveSpecialization;
}

export interface ActiveSpecialization {
  key: Link;
  name: string;
  id: number;
  realm?: ActiveSpecialization;
  slug?: string;
}

export interface Specialization {
  specialization: ActiveSpecialization;
  talents: Talent[];
  glyphs?: ActiveSpecialization[];
  pvp_talent_slots: PvpTalentSlot[];
}

export interface PvpTalentSlot {
  selected: Selected;
  slot_number: number;
}

export interface Selected {
  talent: ActiveSpecialization;
  spell_tooltip: SpellTooltip;
}

export interface SpellTooltip {
  spell: ActiveSpecialization;
  description: string;
  cast_time: CastTime;
  cooldown?: string;
  range?: string;
  power_cost?: null | string;
}

export enum CastTime {
  Instant = 'Instant',
  Passive = 'Passive',
  The1SECCast = '1 sec cast',
}

export interface Talent {
  talent: ActiveSpecialization;
  spell_tooltip: SpellTooltip;
  tier_index: number;
  column_index: number;
}
