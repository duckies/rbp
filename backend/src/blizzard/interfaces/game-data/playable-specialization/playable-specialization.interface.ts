import { Enum, GenderedString, KeyId, KeyNameId, Links } from '../../profile';

export interface PlayableSpecialization {
  _links: Links;
  id: number;
  playable_class: KeyNameId;
  name: string;
  gender_description: GenderedString;
  media: KeyId;
  role: Enum;
  talent_tiers: TalentTier[];
  pvp_talents: PvPTalentTier[];
}

export interface TalentTier {
  level: number;
  talents: Talent[];
  tier_index: number;
}

export interface Talent {
  talent: KeyNameId;
  spell_tooltip: SpellTooltip;
  column_index: number;
}

export interface PvPTalentTier {
  talent: Talent;
}

export interface SpellTooltip {
  description: string;
  cast_time: string;
  power_cost?: string;
  range?: string;
  cooldown?: string;
}
