import { Controller, Get, Param } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discord: DiscordService) {}

  @Get('member/:id')
  async getMember(@Param('id') id: string) {
    return this.discord.getGuildMember(id);
  }
}
