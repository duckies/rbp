import { RaiderIOService } from './raiderIO.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CharacterLookupDto } from '../dto/get-character.dto';
import { RaiderIOCharacterFieldsDto } from './dto/char-fields.dto';
import { JWTGuard } from '../../auth/guards/jwt.guard';

@Controller('raiderio')
export class RaiderIOController {
  constructor(private readonly raiderIOService: RaiderIOService) {}

  @Get('/:region/:realm/:name')
  @UseGuards(JWTGuard)
  fetchCharacter(
    @Param() characterLookupDto: CharacterLookupDto,
    @Query() raiderIOCharacterFieldsDto: RaiderIOCharacterFieldsDto,
  ) {
    return this.raiderIOService.getCharacterRaiderIO(
      characterLookupDto,
      raiderIOCharacterFieldsDto,
    );
  }
}
