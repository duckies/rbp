import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BlizzardService } from './blizzard.service';
import { CharacterLookupDto, CharacterFieldsDto } from './dto/get-character.dto';
import { GuildLookupDto } from './dto/guild-lookup.dto';
import { GuildFieldsDto } from './dto/guild-fields.dto';
import { ComposeGuard } from '../../auth/guards/compose.guard';

@Controller('blizzard')
export class BlizzardController {
  constructor(private readonly blizzardService: BlizzardService) {}

  @Get('character/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  getCharacter(
    @Param() characterLookupDto: CharacterLookupDto,
    @Query() characterFieldsDto: CharacterFieldsDto
  ) {
    return this.blizzardService.getCharacter(characterLookupDto, characterFieldsDto);
  }

  @Get('guild/:region/:realm/:name')
  @UseGuards(ComposeGuard)
  getGuild(@Param() guildLookupDto: GuildLookupDto, @Query() guildFieldsDto: GuildFieldsDto) {
    return this.blizzardService.getGuild(guildLookupDto, guildFieldsDto);
  }
}