import { Controller, Get, Param, UseGuards, Post, Body } from '@nestjs/common';
import { ComposeGuard, JWTGuard } from '../auth/guards';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { BlizzardService } from './blizzard.service';
import { FindCharacterDto } from './dto/find-character.dto';
import { FindGuildDto } from './dto/find-guild.dto';
import * as ProfileAPI from './interfaces';
import { BlizzardTokenCheck } from './interfaces';
import { CharacterEndpoints } from './enum/profile-api.enum';
import { CharacterEndpointsDto } from './dto/endpoints.dto';

@Controller('blizzard')
export class BlizzardController {
  constructor(private readonly blizzardService: BlizzardService) {}

  @Get('check_token')
  @UseGuards(ComposeGuard)
  checkToken(@Usr() user: User): Promise<BlizzardTokenCheck> {
    return this.blizzardService.checkToken(user.blizzardtoken);
  }

  // @Get('characters/user')
  // @UseGuards(ComposeGuard)
  // getUserCharacters(@Usr() user: User): Promise<Partial<User>> {
  //   return this.blizzardService.syncUserCharacters(user);
  // }

  // @Get('character/known')
  // @UseGuards(JWTGuard)
  // getKnownCharacters(@Usr() user: User): Promise<Partial<User>> {
  //   return this.blizzardService.fetchKnownCharacters(user);
  // }

  @Post('character/:region/:realm/:name')
  getCharacterAggregate(@Param() findCharacterDto: FindCharacterDto, @Body()  { endpoints }: CharacterEndpointsDto) {
    return this.blizzardService.getCharacterAggregate(findCharacterDto, endpoints)
  }

  @Get('character/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  getCharacter(@Param() findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileCharacter> {
    return this.blizzardService.getCharacter(findCharacterDto);
  }


  @Get('guild/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  getGuild(@Param() findGuildDto: FindGuildDto): Promise<ProfileAPI.ProfileGuildRoster> {
    return this.blizzardService.getGuildRoster(findGuildDto);
  }
}
