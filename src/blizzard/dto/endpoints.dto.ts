import { IsEnum } from 'class-validator';
import { CharacterEndpoints } from '../enum/profile-api.enum';

export class CharacterEndpointsDto {
  @IsEnum(CharacterEndpoints, { each: true })
  endpoints: CharacterEndpoints[]
}
