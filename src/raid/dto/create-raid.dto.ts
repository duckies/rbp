import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Expansion } from '../raid.entity';

export class CreateRaidDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  expansion: Expansion;

  @IsNotEmpty()
  background: string;

  @IsNotEmpty()
  progress: number;

  @IsNotEmpty()
  difficulty: string;

  @IsNumber()
  bosses: number;

  @IsNotEmpty()
  world: number;

  @IsNotEmpty()
  region: number;

  @IsNotEmpty()
  realm: number;

  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  total_bosses: number;

  @IsNotEmpty()
  normal_bosses_killed: number;

  @IsNotEmpty()
  heroic_bosses_killed: number;

  @IsNotEmpty()
  mythic_bosses_killed: number;

  @IsOptional()
  isFocused: boolean;
}
