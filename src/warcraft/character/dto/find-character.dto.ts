import { IsOptional } from 'class-validator';

export class FindCharacterDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  realm?: string = 'Blackrock';

  @IsOptional()
  region?: string = 'us';
}