import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RealmSlug } from '../../interfaces/realm.enum';

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
  Audit = 'audit',
}

export class CharacterFieldsDto {
  constructor(fields?: CharacterFields[]) {
    this.fields = fields
      ? fields
      : [
          CharacterFields.Guild,
          CharacterFields.Items,
          CharacterFields.Mounts,
          CharacterFields.Pets,
          CharacterFields.Professions,
          CharacterFields.Talents,
          CharacterFields.Progression,
          CharacterFields.PVP,
          CharacterFields.Titles,
        ];
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
    CharacterFields.Titles,
  ];
}

export class CharacterLookupDto {
  constructor(name: string, realm?: RealmSlug, region?: string) {
    this.name = name;
    this.realm = realm ? realm : RealmSlug.Blackrock;
    this.region = region ? region : 'us';
  }

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(RealmSlug)
  realm: RealmSlug;

  @IsNotEmpty()
  region: string;
}
