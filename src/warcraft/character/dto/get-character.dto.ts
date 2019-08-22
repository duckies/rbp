import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetCharacterDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  region?: string = 'us';

  @IsOptional()
  realm?: string = 'Blackrock';

  @IsOptional()
  fields?: string[] = [
    'guild',
    'items',
    'mounts',
    'pets',
    'professions',
    'talents',
    'progression',
    'pvp',
    'titles',
  ];
}
