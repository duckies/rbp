import { RealmName } from './realm.enum';

export interface TooltipParams {
  gem0?: number;
  enchant?: number;
  tinker?: number;
  transmogItem?: number;
  timewalkerLevel: number;
  azeritePower0: number;
  azeritePower1: number;
  azeritePower2: number;
  azeritePower3: number;
  azeritePower4: number;
  azeritePowerLevel: number;
}

export interface Stat {
  stat: number;
  amount: number;
}

export interface Appearance {
  itemId: number;
  itemAppearanceModId: number;
  transmogItemAppearanceModId: number;
}

export interface AzeriteItem {
  azeriteLevel: number;
  azeriteExperience: number;
  azeriteExperienceRemaining: number;
}

export interface AzeritePower {
  id: number;
  tier: number;
  spellId: number;
  bonusListId: number;
}

export interface AzeriteEmpoweredItem {
  azeritePowers?: AzeritePower[];
}

export interface Damage {
  min: number;
  max: number;
  exactMin: number;
  exactMax: number;
}

export interface WeaponInfo {
  damage: Damage;
  weaponSpeed: number;
  dps: number;
}

export interface Item {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  weaponInfo: WeaponInfo;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

export interface Items {
  averageItemLevel: number;
  averageItemLevelEquipped: number;
  head: Item;
  neck: Item;
  shoulder: Item;
  back: Item;
  chest: Item;
  shirt: Item;
  wrist: Item;
  hands: Item;
  waist: Item;
  legs: Item;
  feet: Item;
  finger1: Item;
  finger2: Item;
  trinket1: Item;
  trinket2: Item;
  mainHand: Item;
}

export interface Emblem {
  icon: number;
  iconColor: string;
  iconColorId: number;
  border: number;
  borderColor: string;
  borderColorId: number;
  backgroundColor: string;
  backgroundColorId: number;
}

export interface Guild {
  name: string;
  realm: RealmName;
  battlegroup: string;
  members: number;
  achievementPoints: number;
  emblem: Emblem;
}

export interface Mount {
  name: string;
  spellId: number;
  creatureId: number;
  itemId: number;
  qualityId: number;
  icon: string;
  isGround: boolean;
  isFlying: boolean;
  isAquatic: boolean;
  isJumping: boolean;
}

export interface Mounts {
  numCollected: number;
  numNotCollected: number;
  collected: Mount[];
}

export interface PetStats {
  speciesId: number;
  breedId: number;
  petQualityId: number;
  level: number;
  health: number;
  power: number;
  speed: number;
}

export interface Pet {
  name: string;
  spellId: number;
  creatureId: number;
  itemId: number;
  qualityId: number;
  icon: string;
  stats: PetStats;
  battlePetGuid: string;
  isFavorite: boolean;
  isFirstAbilitySlotSelected: boolean;
  isSecondAbilitySlotSelected: boolean;
  isThirdAbilitySlotSelected: boolean;
  creatureName: string;
  canBattle: boolean;
}

export interface Pets {
  numCollected: number;
  numNotCollected: number;
  collected: Pet[];
}

export interface Profession {
  id: number;
  name: string;
  icon: string;
  rank: number;
  max: number;
  recipes: number[];
}

export interface Professions {
  primary: Profession[];
  secondary: Profession[];
}

export interface Boss {
  id: number;
  name: string;
  normalKills: number;
  normalTimestamp: any;
  heroicKills?: number;
  heroicTimestamp?: number;
  lfrKills?: number;
  lfrTimestamp?: number;
  mythicKills?: number;
  mythicTimestamp?: number;
}

export interface Raid {
  name: string;
  lfr: number;
  normal: number;
  heroic: number;
  mythic: number;
  id: number;
  bosses: Boss[];
}

export interface Progression {
  raids: Raid[];
}

export interface Bracket {
  slug: string;
  rating: number;
  weeklyPlayed: number;
  weeklyWon: number;
  weeklyLost: number;
  seasonPlayed: number;
  seasonWon: number;
  seasonLost: number;
  tier: number;
}

export interface Brackets {
  [bracket: string]: Bracket;
}

export interface PVP {
  brackets: Brackets;
}

export interface Reputation {
  id: number;
  name: string;
  standing: number;
  value: number;
  max: number;
}

export interface Stats {
  health: number;
  powerType: string;
  power: number;
  str: number;
  agi: number;
  int: number;
  sta: number;
  speedRating: number;
  speedRatingBonus: number;
  crit: number;
  critRating: number;
  haste: number;
  hasteRating: number;
  hasteRatingPercent: number;
  mastery: number;
  masteryRating: number;
  leech: number;
  leechRating: number;
  leechRatingBonus: number;
  versatility: number;
  versatilityDamageDoneBonus: number;
  versatilityHealingDoneBonus: number;
  versatilityDamageTakenBonus: number;
  avoidanceRating: number;
  avoidanceRatingBonus: number;
  spellPen: number;
  spellCrit: number;
  spellCritRating: number;
  mana5: number;
  mana5Combat: number;
  armor: number;
  dodge: number;
  dodgeRating: number;
  parry: number;
  parryRating: number;
  block: number;
  blockRating: number;
  mainHandDmgMin: number;
  mainHandDmgMax: number;
  mainHandSpeed: number;
  mainHandDps: number;
  offHandDmgMin: number;
  offHandDmgMax: number;
  offHandSpeed: number;
  offHandDps: number;
  rangedDmgMin: number;
  rangedDmgMax: number;
  rangedSpeed: number;
  rangedDps: number;
}

export interface SpecializationInfo {
  name: string;
  role: string;
  backgroundImage: string;
  icon: string;
  description: string;
  order: number;
}

export interface Spell {
  id: number;
  name: string;
  icon: string;
  description: string;
  range: string;
  castTime: string;
  cooldown: string;
  powerCost: string;
}

export interface Talent {
  tier: number;
  column: number;
  spell: Spell;
  spec: SpecializationInfo;
}

export interface Specialization {
  selected: boolean;
  talents: Talent[];
  spec: SpecializationInfo;
  calcTalent: string;
  calcSpec: string;
}

export interface Title {
  id: number;
  name: string;
  selected?: boolean;
}

export interface CharacterResponse {
  lastModified: number;
  name: string;
  realm: RealmName;
  battlegroup: string;
  class: number;
  race: number;
  gender: number;
  level: number;
  achievementPoints: number;
  thumbnail: string;
  calcClass: string;
  faction: number;
  items?: Items;
  guild?: Guild;
  mounts?: Mounts;
  pets?: Pets;
  professions?: Professions;
  progression?: Progression;
  pvp?: PVP;
  quests?: number[];
  reputation?: Reputation[];
  stats?: Stats;
  talents?: Specialization[];
  titles?: Title[];
  totalHonorableKills: number;
}
