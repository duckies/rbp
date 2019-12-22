import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Character } from './character.entity';
import { CharacterService } from './character.service';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ComposeGuard } from '../auth/guards';
import { User } from '../user/user.entity';
import { Usr } from '../user/user.decorator';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get('roster')
  getRoster(): Promise<Character[]> {
    return this.characterService.findRoster();
  }

  @Get('/:region/:realm/:name')
  findOne(@Param() findCharacterDto: FindCharacterDto): Promise<Character> {
    return this.characterService.findOne(findCharacterDto);
  }

  @Put('main/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  setMain(@Usr() user: User, @Param() findCharacterDto: FindCharacterDto): Promise<User> {
    return this.characterService.setMain(user, findCharacterDto);
  }
}
