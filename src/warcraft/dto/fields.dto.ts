import { IsOptional } from 'class-validator';
import { CharacterFields } from '../interfaces/character.interface';

export class CharacterFieldsDto {
  constructor(fields?: CharacterFields[]) {
    this.fields = fields || [
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
