import { Controller, Get, Param } from '@nestjs/common';
import { GameDataService } from './game-data.service';

@Controller('game-data')
export class GameDataController {
  constructor(private readonly gameDataService: GameDataService) {}

  @Get('/item/:id')
  cacheItem(@Param('id') id: number) {
    return this.gameDataService.getGameItemMedia(id);
  }

  @Get('/class/:id')
  getClass(@Param('id') id: number) {
    return this.gameDataService.getPlayableClass(id);
  }

  @Get('/specialization/:id')
  getSpecialization(@Param('id') id: number) {
    return this.gameDataService.getPlayableSpecialization(id);
  }
}
