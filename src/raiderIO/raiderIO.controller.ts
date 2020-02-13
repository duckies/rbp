import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RaiderIOCharacterFieldsDto } from './dto/char-fields.dto';
import { RaiderIOService } from './raiderIO.service';
import { JWTGuard } from '../auth/guards';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';

@Controller('raiderio')
export class RaiderIOController {
  constructor(private readonly raiderIOService: RaiderIOService) {}

  // @Get('/:region/:realm/:name')
  // @UseGuards(JWTGuard)
  // fetchCharacter(
  //   @Param() findCharacterDto: FindCharacterDto,
  //   @Query() raiderIOCharacterFieldsDto: RaiderIOCharacterFieldsDto,
  // ) {
  //   return this.raiderIOService.getCharacterRaiderIO(findCharacterDto, raiderIOCharacterFieldsDto);
  // }
}
