import { Asset } from '../../game-data/item/item-media.interface';
import { Character, Enum, KeyId, KeyNameId, Link, Links, RGBA } from '../shared-profile.interface';

export interface CharacterEquipmentSummary {
  _links: Links;
  character: Character;
  equipped_items: EquippedItem[];
}

export interface ItemMedia {
  id: number;
  key: Link;
  assets?: Asset;
}

export interface EquippedItem {
  item: KeyId;
  slot: Enum;
  quantity: number;
  context: number;
  bonus_list: number[];
  quality: Enum;
  name: string;
  modified_appearance_id?: number;
  azerite_details?: AzeriteDetails;
  media: ItemMedia;
  item_class: KeyNameId;
  item_subclass: KeyNameId;
  inventory_type: Enum;
  binding: Enum;
  armor?: Armor;
  stats?: Stat[];
  spells?: EquipmentSpell[];
  requirements?: Requirements;
  level: Level;
  transmog: Transmog;
  is_subclass_hidden?: boolean;
  durability?: Durability;
  name_description: NameDescription;
}

export interface AzeriteDetails {
  selected_powers: AzeritePower[];
  selected_powers_string: string;
  level: HeartLevel;
}

export interface HeartLevel {
  value: number;
  display_string: string;
}

export interface AzeritePower {
  id: number;
  tier: number;
  spell_tooltip: SpellTooltip;
  is_display_hidden: boolean;
}

export interface SpellTooltip {
  spell: KeyNameId;
  description: string;
  cast_time: string;
  range?: string;
  cooldown?: string;
}

export interface Armor {
  value: number;
  display: Display;
}

export interface Display {
  display_string: string;
  color: RGBA;
}

export interface Stat {
  type: Enum;
  value: number;
  display: Display;
}

export interface Requirements {
  level: Level;
}

export interface Level {
  value: number;
  display_string: string;
}

export interface Transmog {
  item: KeyNameId;
  display_string: string;
  item_modified_appearance_id: number;
}

export interface Durability {
  value: number;
  display_string: string;
}

export interface NameDescription {
  display_string: string;
  color: RGBA;
}

export interface HeartOfAzeroth {
  percentage_to_next_level: number;
  selected_essences: SelectedEssence[];
  level: Level;
}

export interface SelectedEssence {
  slot: number;
  rank: number;
  main_spell_tooltip?: SpellTooltip;
  passive_spell_tooltip: SpellTooltip;
  essence: KeyNameId;
  media: KeyId;
}

export interface EquipmentSpell {
  spell: KeyNameId;
  description: string;
}
