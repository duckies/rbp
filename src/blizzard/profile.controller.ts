<<<<<<< HEAD
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccessControlGuard } from '../auth/guards';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { ProfileApiService, ProfileEndpointReturnType } from './profile-api.service';
import { CharacterEndpointsDto } from './dto/endpoints.dto';
import { FindCharacterDto } from './dto/find-character.dto';
import { FindGuildDto } from './dto/find-guild.dto';
import { CharacterEndpoints } from './enum/profile-api.enum';
import * as ProfileAPI from './interfaces';
import { BlizzardTokenCheck } from './interfaces';

@Controller('blizzard')
export class BlizzardController {
  constructor(private readonly profileApiService: ProfileApiService) {}

  @Get('token')
  @UseGuards(AccessControlGuard)
  checkToken(@Usr() user: User): Promise<BlizzardTokenCheck> {
    return this.profileApiService.checkToken(user);
  }

  @Post('character/:region/:realm/:name')
  getCharacterAggregate<T extends CharacterEndpoints>(
    @Param() findCharacterDto: FindCharacterDto,
    @Body() { endpoints }: CharacterEndpointsDto,
  ): Promise<ProfileEndpointReturnType[T][]> {
    return this.profileApiService.getCharacterAggregate(findCharacterDto, endpoints as T[]);
  }

  @Get('character/:region/:realm/:name')
  @UseGuards(AccessControlGuard)
  getCharacter(@Param() findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileCharacter> {
    return this.profileApiService.getCharacter(findCharacterDto);
  }

  @Get('guild/:region/:realm/:name')
  @UseGuards(AccessControlGuard)
  getGuild(@Param() findGuildDto: FindGuildDto): Promise<ProfileAPI.ProfileGuildRoster> {
    return this.profileApiService.getGuildRoster(findGuildDto);
=======
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AccessControlGuard } from '../auth/guards';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { BattleNetService } from './battle.net.service';
import { FindCharacterDto } from './dto/find-character.dto';
import { FindGuildDto } from './dto/find-guild.dto';
import { TokenValidation } from './interfaces/battle.net/token-validation.interface';
import * as Profile from './interfaces/profile';
import { ProfileService } from './profile.service';

@Controller('blizzard')
@UseGuards(AccessControlGuard)
export class BlizzardController {
  constructor(private readonly battleNetService: BattleNetService, private readonly profileService: ProfileService) {}

  @Get('token')
  checkToken(@Usr() user: User): Promise<TokenValidation> {
    return this.battleNetService.checkToken(user);
  }

  @Get('user/characters')
  getAccountProfileSummary(user: User): Promise<Profile.AccountProfileSummary> {
    return this.profileService.getAccountProfileSummary(user);
  }

  @Get('character/:region/:realm/:name')
  getCharacter(@Param() findCharacterDto: FindCharacterDto): Promise<Profile.CharacterProfileSummary> {
    return this.profileService.getCharacterProfileSummary(findCharacterDto);
  }

  @Get('guild/:region/:realm/:name')
  getGuild(@Param() findGuildDto: FindGuildDto): Promise<Profile.GuildRoster> {
    return this.profileService.getGuildRoster(findGuildDto);
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  }
}
