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
  }
}
