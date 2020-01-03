import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { GameDataEndpoint } from '../enum/game-data-api.enum';

export class GameDataAggregateDto {
  @IsEnum(GameDataEndpoint, { each: true })
  endpoints: GameDataEndpoint[]

  @IsOptional()
  param?: string | number
}