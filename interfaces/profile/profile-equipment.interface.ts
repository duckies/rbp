import { Links, Link, RGBA, Character } from '../blizzard-shared.interface'

export interface ProfileEquipment {
  _links: Links
  character: Character
  equipped_items?: EquippedItemsEntity[] | null
}

export interface EquippedItemsEntity {
  item: ItemOrMedia
  slot: TypeOrSlotOrQualityOrInventoryTypeOrBindingOrSocketTypeOrDamageClass
  quantity: number
  context: number
  bonus_list?: number[] | null
  quality: TypeOrSlotOrQualityOrInventoryTypeOrBindingOrSocketTypeOrDamageClass
  name: string
  modified_appearance_id?: number | null
  azerite_details?: AzeriteDetails | null
  media: ItemOrMedia
  item_class: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  item_subclass: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  inventory_type: TypeOrSlotOrQualityOrInventoryTypeOrBindingOrSocketTypeOrDamageClass
  binding: TypeOrSlotOrQualityOrInventoryTypeOrBindingOrSocketTypeOrDamageClass
  armor?: LevelOrArmorOrDurabilityOrAttackSpeedOrDps | null
  stats?: StatsEntity[] | null
  requirements?: Requirements | null
  level: LevelOrArmorOrDurabilityOrAttackSpeedOrDps1
  transmog?: Transmog | null
  durability?: LevelOrArmorOrDurabilityOrAttackSpeedOrDps2 | null
  name_description?: NameDescription | null
  unique_equipped?: string | null
  spells?: SpellsEntityOrSpell[] | null
  description?: string | null
  is_subclass_hidden?: boolean | null
  sockets?: SocketsEntity[] | null
  sell_price?: SellPrice | null
  enchantments?: EnchantmentsEntity[] | null
  limit_category?: string | null
  weapon?: Weapon | null
}

export interface ItemOrMedia {
  key: Link
  id: number
}

export interface TypeOrSlotOrQualityOrInventoryTypeOrBindingOrSocketTypeOrDamageClass {
  type: string
  name: string
}

export interface AzeriteDetails {
  selected_powers?: SelectedPowersEntity[] | null
  selected_powers_string?: string | null
  percentage_to_next_level?: number | null
  selected_essences?: SelectedEssencesEntity[] | null
  level?: LevelOrArmorOrDurabilityOrAttackSpeedOrDps3 | null
}

export interface SelectedPowersEntity {
  id: number
  tier: number
  spell_tooltip: SpellTooltipOrPassiveSpellTooltip
  is_display_hidden?: boolean | null
}

export interface SpellTooltipOrPassiveSpellTooltip {
  spell: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  description: string
  cast_time: string
}

export interface SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem {
  key: Link
  name: string
  id: number
}

export interface SelectedEssencesEntity {
  slot: number
  rank: number
  main_spell_tooltip?: MainSpellTooltip | null
  passive_spell_tooltip: SpellTooltipOrPassiveSpellTooltip
  essence: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  media: ItemOrMedia
}

export interface MainSpellTooltip {
  spell: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  description: string
  cast_time: string
  cooldown: string
}

export interface LevelOrArmorOrDurabilityOrAttackSpeedOrDps3 {
  value: number
  display_string: string
}

export interface LevelOrArmorOrDurabilityOrAttackSpeedOrDps {
  value: number
  display_string: string
}

export interface StatsEntity {
  type: TypeOrSlotOrQualityOrInventoryTypeOrBindingOrSocketTypeOrDamageClass
  value: number
  display_string: string
  is_negated?: boolean | null
  is_equip_bonus?: boolean | null
}

export interface Requirements {
  level: LevelOrArmorOrDurabilityOrAttackSpeedOrDps1
  skill?: Skill | null
}

export interface LevelOrArmorOrDurabilityOrAttackSpeedOrDps1 {
  value: number
  display_string: string
}

export interface Skill {
  profession: Profession
  level: number
  display_string: string
}

export interface Profession {
  name: string
  id: number
}

export interface Transmog {
  item: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  display_string: string
  item_modified_appearance_id: number
}

export interface LevelOrArmorOrDurabilityOrAttackSpeedOrDps2 {
  value: number
  display_string: string
}

export interface NameDescription {
  display_string: string
  color: RGBA
}

export interface SpellsEntityOrSpell {
  spell: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  description: string
}

export interface SocketsEntity {
  socket_type: TypeOrSlotOrQualityOrInventoryTypeOrBindingOrSocketTypeOrDamageClass
  item: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  display_string: string
  media: ItemOrMedia
}

export interface SellPrice {
  value: number
  display_strings: DisplayStrings
}

export interface DisplayStrings {
  header: string
  gold: string
  silver: string
  copper: string
}

export interface EnchantmentsEntity {
  display_string: string
  source_item?: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem1 | null
  enchantment_id: number
  enchantment_slot: EnchantmentSlot
  spell?: SpellsEntityOrSpell1 | null
}

export interface SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem1 {
  key: Link
  name: string
  id: number
}

export interface EnchantmentSlot {
  id: number
  type: string
}

export interface SpellsEntityOrSpell1 {
  spell: SpellOrItemOrItemClassOrItemSubclassOrEssenceOrSourceItem
  description: string
}

export interface Weapon {
  damage: Damage
  attack_speed: LevelOrArmorOrDurabilityOrAttackSpeedOrDps1
  dps: LevelOrArmorOrDurabilityOrAttackSpeedOrDps1
}

export interface Damage {
  min_value: number
  max_value: number
  display_string: string
  damage_class: TypeOrSlotOrQualityOrInventoryTypeOrBindingOrSocketTypeOrDamageClass
}
