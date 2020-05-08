import { Injectable } from '@nestjs/common';
import { Client, Message } from 'discord.js';
import { DiscordService } from '../discord.service';
import { Event } from '../interfaces/event.interface';

@Injectable()
// @Cog.Event(DiscordEvent.Message)
export class MessageEvent implements Event {
  constructor(private readonly discord: DiscordService) {}

  async execute(_client: Client, message: Message) {
    // // Ignore bots or messages without the prefix.
    // if (message.author.bot || !message.content.startsWith(this.discord.prefix)) {
    //   return;
    // }
    // const [name, ...args] = message.content.slice(this.discord.prefix.length).trim().split(/ +/g);
    // const match = this.discord.getCommand(name);
    // if (!match) {
    //   await message.reply(`I don't know that one.`);
    // } else {
    //   const subCommand = args.length ? this.discord.getSubCommand(name, args[0]) : null;
    //   console.log(subCommand);
    //   if (subCommand) {
    //     await match.command[subCommand.method](message, args);
    //   } else {
    //     await match.command.execute(message, args);
    //   }
    // }
  }
}
