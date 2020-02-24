import { IsEnum } from 'class-validator';
<<<<<<< HEAD
import { CharacterEndpoints } from '../enum/profile-api.enum';

export class CharacterEndpointsDto {
  @IsEnum(CharacterEndpoints, { each: true })
  endpoints: CharacterEndpoints[]
=======
import { ProfileEndpoints } from '../enum/profile-api.enum';

export class CharacterEndpointsDto {
  @IsEnum(ProfileEndpoints, { each: true })
  endpoints: ProfileEndpoints[];
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
}
