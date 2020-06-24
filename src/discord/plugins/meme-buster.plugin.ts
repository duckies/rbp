import { Injectable, Logger } from '@nestjs/common';
import { Client, Message } from 'discord.js';
import { Event, Plugin } from '../discord.decorators';
import { DiscordEvent } from '../interfaces/events.enum';
import { DiscordPlugin } from './plugin.class';

@Injectable()
@Plugin({ name: 'MemeBuster' })
export class MemeBusterPlugin extends DiscordPlugin {
  private readonly logger = new Logger(MemeBusterPlugin.name);

  @Event(DiscordEvent.Message)
  async onMessage(_client: Client, message: Message) {
    try {
      if (message.partial) {
        await message.fetch();
      }

      const channel = message.guild.channels.cache.get(message.channel.id);

      if (!channel) return;

      await channel.guild.members.fetch();

      const messages = await message.channel.messages.fetch({ limit: 20 });

      for (const [, oldMessage] of messages) {
        const member = message.guild.members.cache.get(oldMessage.author.id);
        const name = member.nickname || member.displayName;

        if (member.user.bot) continue;

        if (message.content.includes(name) && message.content.includes('Today at')) {
          await message.delete();
          break;
        }
      }
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }
}
