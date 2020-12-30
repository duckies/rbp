import { Character, Link, Links } from '../blizzard-shared.interface'

export interface ProfileSpecializations {
  _links: Links
  specializations: SpecializationMeta[]
  active_specialization: Specialization
  character: Character
}

export interface SpecializationMeta {
  specialization: Specialization
  talents: TalentMeta[]
  glyphs?: Glyph[]
  pvp_talent_slots: PvpTalentSlot[]
}

export interface PvpTalentSlot {
  selected: SelectedTalent
  slot_number: number
}

export interface SelectedTalent {
  talent: Talent
  spell_tooltip: SpellTooltip
}

export interface SpellTooltip {
  spell: Spell
  description: string
  cast_time: string
  cooldown?: string
  range?: string
  power_cost?: null | string
}

export interface TalentMeta {
  talent: Talent
  spell_tooltip: SpellTooltip
  tier_index: number
  column_index: number
}

export interface Specialization {
  key: Link
  name: string
  id: number
}

export interface Talent {
  key: Link
  name: string
  id: number
}

export interface Spell {
  key: Link
  name: string
  id: number
}

export interface Glyph {
  key: Link
  name: string
  id: number
}
