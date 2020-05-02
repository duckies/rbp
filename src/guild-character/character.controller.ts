import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { AccessControlGuard, JWTGuard } from '../auth/guards';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { GuildCharacter } from './character.entity';
import { CharacterService } from './character.service';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get('roster')
  getRoster(): Promise<GuildCharacter[]> {
    return this.characterService.findRoster();
  }

  // @Get('/known')
  // @UseGuards(JWTGuard)
  // getKnownCharacters(
  //   @Usr() user: User,
  //   @Query('force') force: boolean | undefined = undefined,
  // ): Promise<Partial<User>> {
  //   return this.characterService.fetchKnownCharacters(user, force);
  // }

  @Get('/:region/:realm/:name')
  findOne(@Param() findCharacterDto: FindCharacterDto): Promise<GuildCharacter> {
    return this.characterService.findOne(findCharacterDto);
  }

  // @Put('main/:region/:realm/:name')
  // @UseGuards(AccessControlGuard)
  // setMain(@Usr() user: User, @Param() findCharacterDto: FindCharacterDto): Promise<User> {
  //   return this.characterService.setMain(user, findCharacterDto);
  // }
}
