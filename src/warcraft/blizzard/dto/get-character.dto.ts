import { IsNotEmpty, IsOptional } from 'class-validator';

export enum CharacterFields {
  Achievements = 'achievements',
  Appearance = 'appearance',
  Feed = 'feed',
  Guild = 'guild',
  HunterPets = 'hunterPets',
  Items = 'items',
  Mounts = 'mounts',
  Pets = 'pets',
  PetSlots = 'petSlots',
  Professions = 'professions',
  Progression = 'progression',
  PVP = 'pvp',
  Quests = 'quests',
  Reputation = 'reputation',
  Statistics = 'statistics',
  Stats = 'stats',
  Talents = 'talents',
  Titles = 'titles',
  Audit = 'audit'
}

export class CharacterFieldsDto {
  constructor(fields?: CharacterFields[]) {
    this.fields = fields ? fields : [
      CharacterFields.Guild,
      CharacterFields.Items,
      CharacterFields.Mounts,
      CharacterFields.Pets,
      CharacterFields.Professions,
      CharacterFields.Talents,
      CharacterFields.Progression,
      CharacterFields.PVP,
      CharacterFields.Titles
    ]
  }

  @IsOptional()
  fields: CharacterFields[] = [
    CharacterFields.Guild,
    CharacterFields.Items,
    CharacterFields.Mounts,
    CharacterFields.Pets,
    CharacterFields.Professions,
    CharacterFields.Talents,
    CharacterFields.Progression,
    CharacterFields.PVP,
    CharacterFields.Titles
  ]
}

export class CharacterLookupDto {
  constructor(name: string, realm: string, region?: string) {
    this.name = name;
    this.realm = realm;
    this.region = region ? region : 'us';
  }

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  realm: string;

  @IsNotEmpty()
  region: string;
}