import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { ComposeGuard } from '../../auth/guards/compose.guard';
import { Usr } from '../../user/user.decorator';
import { User } from '../../user/user.entity';
import { CharacterLookupDto } from '../blizzard/dto/get-character.dto';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get('roster')
  getRoster(): Promise<Character[]> {
    return this.characterService.findRoster();
  }

  @Get('/:region/:realm/:name')
  findOne(@Param() characterLookupDto: CharacterLookupDto): Promise<Character> {
    return this.characterService.findOne(characterLookupDto);
  }

  @Put('main/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  setMain(
    @Usr() user: User,
    @Param() characterLookupDto: CharacterLookupDto,
  ): Promise<User> {
    return this.characterService.setMain(user, characterLookupDto);
  }
}
