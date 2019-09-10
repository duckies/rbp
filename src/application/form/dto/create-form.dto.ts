import { IsEnum, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { CharacterResponse } from '../../../warcraft/interfaces/character-response.interface';
import { RealmName } from '../../../warcraft/interfaces/realm.enum';
import { Field } from '../../field/field.entity';

export class CreateFormDto {
  @IsNotEmpty()
  characterName: string;

  @IsNotEmpty()
  @IsEnum(RealmName)
  characterRealm: RealmName;

  @IsNotEmpty()
  characterRegion: string;

  @IsOptional()
  characterData: CharacterResponse;

  @IsNotEmpty()
  fields: Field[];
}
