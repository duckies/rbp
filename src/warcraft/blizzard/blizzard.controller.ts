import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BlizzardService } from './blizzard.service';
import { CharacterLookupDto, CharacterFieldsDto } from '../dto/get-character.dto';
import { GuildLookupDto } from '../dto/guild-lookup.dto';
import { GuildFieldsDto } from '../dto/guild-fields.dto';
import { ComposeGuard } from '../../auth/guards/compose.guard';
import { Usr } from '../../user/user.decorator';
import { User } from '../../user/user.entity';
import { KnownCharacter } from '../../user/interfaces/known-character.interface';

@Controller('blizzard')
export class BlizzardController {
  constructor(private readonly blizzardService: BlizzardService) {}

  @Get('check_token')
  @UseGuards(ComposeGuard)
  checkToken(@Usr() user: User) {
    return this.blizzardService.checkToken(user.blizzardtoken);
  }

  @Get('character/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  getCharacter(
    @Param() characterLookupDto: CharacterLookupDto,
    @Query() characterFieldsDto: CharacterFieldsDto
  ) {
    return this.blizzardService.getCharacter(characterLookupDto, characterFieldsDto);
  }

  @Get('characters/user')
  @UseGuards(ComposeGuard)
  getUserCharacters(@Usr() user: User) {
    return this.blizzardService.syncUserCharacters(user);
  }

  @Get('guild/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  getGuild(@Param() guildLookupDto: GuildLookupDto, @Query() guildFieldsDto: GuildFieldsDto) {
    return this.blizzardService.getGuild(guildLookupDto, guildFieldsDto);
  }
}