import { Controller, Body, Get, Param } from '@nestjs/common';
<<<<<<< HEAD
import { GameDataService } from './game-data-api.service';
=======
import { GameDataService } from './game-data.service';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { GameDataAggregateDto } from './dto/game-data-endpoints.dto';

@Controller('game-data')
export class GameDataController {
  constructor(private readonly gameDataService: GameDataService) {}

  @Get('/item/:id')
  cacheItem(@Param('id') id: number) {
<<<<<<< HEAD
    return this.gameDataService.getGameItemMedia(id, true)
=======
    return this.gameDataService.getGameItemMedia(id, true);
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  }

  @Get('/aggregate')
  getGameData(@Body() { endpoints, param }: GameDataAggregateDto): Promise<unknown> {
<<<<<<< HEAD
    return this.gameDataService.getGameData(endpoints[0], param)
  } 
=======
    return this.gameDataService.getGameData(endpoints[0], param);
  }
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
}
