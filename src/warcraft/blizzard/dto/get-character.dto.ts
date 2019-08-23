import {
  IsNotEmpty,
  IsOptional,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { RealmSlug, RealmName } from '../../interfaces/realm.interface';
import { RealmNameToSlug, RealmSlugToName } from '../realm.map';

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

/**
 * Checks if the given value is a WoW US Realm.
 * @param validationOptions
 */
export function IsRealm(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRealm',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(realm: any, args: ValidationArguments): boolean {
          if (realm[0] === realm[0].toUpperCase()) {
            return !!RealmNameToSlug.get(realm as RealmName);
          }

          return !!RealmSlugToName.get(realm as RealmSlug);
        },
      },
    });
  };
}

export class CharacterLookupDto {
  constructor(name: string, realm?: RealmName, region?: string) {
    this.name = name;
    this.realm = realm ? realm : RealmName.Blackrock;
    this.region = region ? region : 'us';
  }

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsRealm({
    message: 'Realm $value was not found.',
  })
  realm: RealmSlug | RealmName;

  @IsNotEmpty()
  region: string;

  /**
   * If the realm name is a slug, changes it to the realm name.
   */
  toRealmName(): this {
    if (this.realm[0] !== this.realm[0].toUpperCase())
      this.realm = RealmSlugToName.get(this.realm as RealmSlug);

    return this;
  }
}
