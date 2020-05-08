import { Injectable } from '@nestjs/common';
import { Message } from 'discord.js';
import { Context } from '../discord.context';
import { Cog, Command, CommandGroup } from '../discord.decorators';
import { DiscordCog } from '../interfaces/command.interface';

@Injectable()
@Cog('Settings')
export class SetCommand {
  @CommandGroup('set')
  async set() {
    console.log('Calling set method.');
  }

  @Command({ name: 'watching', group: 'set', description: 'Sets the watching status' })
  async setWatching(ctx: Context, status: string) {
    await ctx.client.user.setActivity({ name: status, type: 'WATCHING' });
  }

  @Command({ name: 'playing', group: 'set', description: 'Sets the playing status' })
  async setPlaying() {
    console.log('Called playing.');
  }
}
