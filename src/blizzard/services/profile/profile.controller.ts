import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AccessControlGuard } from '../../../auth/guards';
import { FindCharacterDto } from '../../dto/find-character.dto';
import { FindGuildDto } from '../../dto/find-guild.dto';
import * as Profile from '../../interfaces/profile';
import { BattleNetService } from '../battle-net/battle-net.service';
import { ProfileService } from './profile.service';

@Controller('blizzard')
@UseGuards(AccessControlGuard)
export class ProfileController {
  constructor(
    private readonly battleNetService: BattleNetService,
    private readonly profileService: ProfileService,
  ) {}

  // @Get('token')
  // checkToken(@Usr() user: User): Promise<TokenValidation> {
  //   return this.battleNetService.checkToken(user);
  // }

  // @Get('user/characters')
  // getAccountProfileSummary(user: User): Promise<Profile.AccountProfileSummary> {
  //   return this.profileService.getAccountProfileSummary(user);
  // }

  @Get('character/:region/:realm/:name')
  private async getCharacter(
    @Param() findCharacterDto: FindCharacterDto,
  ): Promise<Profile.CharacterProfileSummary> {
    return (await this.profileService.getCharacterProfileSummary(findCharacterDto)).data;
  }

  @Get('guild/:region/:realm/:name')
  private async getGuild(@Param() findGuildDto: FindGuildDto): Promise<Profile.GuildRoster> {
    return (await this.profileService.getGuildRoster(findGuildDto)).data;
  }
}
