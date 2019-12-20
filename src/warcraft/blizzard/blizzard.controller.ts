import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { JWTGuard } from '../../auth/guards';
import { ComposeGuard } from '../../auth/guards/compose.guard';
import { Usr } from '../../user/user.decorator';
import { User } from '../../user/user.entity';
import { CharacterLookupDto } from '../dto/get-character.dto';
import { GuildLookupDto } from '../dto/guild-lookup.dto';
import { CharacterResponse } from '../interfaces/character-response.interface';
import GuildResponse from '../interfaces/guild.interface';
import { BlizzardService } from './blizzard.service';
import { BlizzardFilter } from './filters/blizzard.filter';
import { BlizzardTokenCheck } from './interfaces/check-token.interface';
import { FindCharacterDto } from '../character/dto/find-character.dto';
import { ProfileAchievements } from './interfaces/profile-achievements.interface';
import { ProfileCollectionsIndex } from './interfaces/profile-collections-index.interface';

@Controller('blizzard')
@UseFilters(new BlizzardFilter())
export class BlizzardController {
  constructor(private readonly blizzardService: BlizzardService) {}

  @Get('check_token')
  @UseGuards(ComposeGuard)
  checkToken(@Usr() user: User): Promise<BlizzardTokenCheck> {
    return this.blizzardService.checkToken(user.blizzardtoken);
  }

  @Get('character/known')
  @UseGuards(JWTGuard)
  getKnownCharacters(@Usr() user: User): Promise<Partial<User>> {
    return this.blizzardService.fetchKnownCharacters(user);
  }

  @Get('character/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  getCharacter(@Param() characterLookupDto: CharacterLookupDto): Promise<CharacterResponse> {
    return this.blizzardService.fetchCharacterProfile(characterLookupDto);
  }

  @Get('characters/user')
  @UseGuards(ComposeGuard)
  getUserCharacters(@Usr() user: User): Promise<Partial<User>> {
    return this.blizzardService.syncUserCharacters(user);
  }

  @Get('guild/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  getGuild(@Param() guildLookupDto: GuildLookupDto): Promise<GuildResponse> {
    return this.blizzardService.fetchGuild(guildLookupDto);
  }
}
