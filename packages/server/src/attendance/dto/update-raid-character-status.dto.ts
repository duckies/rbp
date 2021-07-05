import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CharacterStatus } from '../interfaces/character-status.enum';

export class UpdateRaidCharacterStatusDTO {
  @IsOptional()
  @IsEnum(CharacterStatus)
  readonly status?: CharacterStatus;

  @IsOptional()
  @IsNumber()
  readonly points?: number;
}
