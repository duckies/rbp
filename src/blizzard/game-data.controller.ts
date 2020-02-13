import { Controller, Body, Get, Param } from '@nestjs/common';
import { GameDataService } from './game-data.service';
import { GameDataAggregateDto } from './dto/game-data-endpoints.dto';

@Controller('game-data')
export class GameDataController {
  constructor(private readonly gameDataService: GameDataService) {}

  @Get('/item/:id')
  cacheItem(@Param('id') id: number) {
    return this.gameDataService.getGameItemMedia(id, true);
  }

  @Get('/aggregate')
  getGameData(@Body() { endpoints, param }: GameDataAggregateDto): Promise<unknown> {
    return this.gameDataService.getGameData(endpoints[0], param);
  }
}
