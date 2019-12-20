import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JWTGuard } from '../../auth/guards/jwt.guard';
import { CharacterLookupDto } from '../dto/get-character.dto';
import { RaiderIOCharacterFieldsDto } from './dto/char-fields.dto';
import { RaiderIOService } from './raiderIO.service';

@Controller('raiderio')
export class RaiderIOController {
  constructor(private readonly raiderIOService: RaiderIOService) {}

  @Get('/:region/:realm/:name')
  @UseGuards(JWTGuard)
  fetchCharacter(
    @Param() characterLookupDto: CharacterLookupDto,
    @Query() raiderIOCharacterFieldsDto: RaiderIOCharacterFieldsDto,
  ): Promise<unknown> {
    return this.raiderIOService.getCharacterRaiderIO(characterLookupDto, raiderIOCharacterFieldsDto);
  }
}
