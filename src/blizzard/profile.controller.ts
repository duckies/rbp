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
  }
}
