import { Injectable } from '@nestjs/common';
import { Context } from '../discord.context';
import { Cog, Command } from '../discord.decorators';
import { DiscordCog } from '../interfaces/command.interface';

@Injectable()
@Cog({ name: 'PingPong' })
export class PingCommand implements DiscordCog {
  getHelpMessage(prefix: string) {
    return `Use ${prefix}ping and I will reply with pong.`;
  }

  @Command({ name: 'ping' })
  async pong(ctx: Context) {
    await ctx.message.reply('Pong!');
  }
}
