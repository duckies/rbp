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

export class UpdateCharacterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  realm: string;

  @IsNotEmpty()
  region: string;

  @IsOptional()
  rank?: number;

  @IsNotEmpty()
  fields: CharacterFields[] = [
    CharacterFields.Guild,
    CharacterFields.Items,
    CharacterFields.Mounts,
    CharacterFields.Pets,
    CharacterFields.Professions,
    CharacterFields.Progression,
    CharacterFields.PVP,
    CharacterFields.Talents,
    CharacterFields.Titles
  ]
}