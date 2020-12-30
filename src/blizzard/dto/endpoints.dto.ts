import { IsEnum } from 'class-validator';
import { ProfileEndpoint } from '../enums/profile-api.enum';

export class CharacterEndpointsDto {
  @IsEnum(ProfileEndpoint, { each: true })
  endpoints: ProfileEndpoint[];
}
