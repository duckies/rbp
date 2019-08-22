import { IsNotEmpty } from 'class-validator';

export class GuildLookupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  realm: string;

  @IsNotEmpty()
  region: string;
}