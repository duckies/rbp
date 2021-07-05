import { Type } from 'class-transformer';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { CharacterStatus } from '../interfaces/character-status.enum';
import { FindRaidIdentityDTO } from './find-raid-identity.dto';

export class CreateRaidCharacterStatusDTO {
  @IsEnum(CharacterStatus)
  readonly status!: CharacterStatus;

  @IsNumber()
  readonly points!: number;

  @IsNumber()
  readonly identityId!: number;

  @IsNumber()
  readonly raidNightId!: number;
}
