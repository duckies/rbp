import { Injectable } from '@nestjs/common';
import { Message } from 'discord.js';
import { Cog } from '../discord.decorators';
import { DiscordService } from '../discord.service';

@Injectable()
@Cog({ name: 'help' })
export class HelpCommand {
  constructor(private readonly discord: DiscordService) {}

  // TODO: Cache the help command.
  async execute(message: Message, args?: string[]) {
    // const allowedCommands = this.discord.allowedCommands(message.author);

    // List available commands.
    if (!args.length) {
      // const names = allowedCommands.map((command) => command.name);
      // await message.channel.send(`You may send the following commands:\n${names.join(', ')}`);
    }
  }
}
