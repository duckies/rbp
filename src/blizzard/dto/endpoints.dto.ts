import { CharacterEndpoints } from '../enum/profile-api.enum';
import { IsEnum } from 'class-validator';

export class CharacterEndpointsDto {
  @IsEnum(CharacterEndpoints, { each: true })
  endpoints: CharacterEndpoints[]
}