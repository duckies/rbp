import { IsNotEmpty, IsOptional } from 'class-validator';
import { RealmSlug, RealmName } from '../interfaces/realm.enum';
import { IsInEnums } from '../validators/blizzard-realm.validator';
import { Region } from '../interfaces/region.enum';
import { CharacterFields } from '../interfaces/character.interface';

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
  constructor(name: string, realm?: RealmSlug, region?: Region) {
    this.name = name;
    this.realm = realm ? realm : RealmSlug.Blackrock;
    this.region = region ? region : Region.US;
  }

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsInEnums([RealmName, RealmSlug], { message: '$value is not a valid realm name or realm slug.' })
  readonly realm: RealmName | RealmSlug;

  @IsNotEmpty()
  readonly region: Region;
}
