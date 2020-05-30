import { Injectable } from '@nestjs/common';
import { Client, Message } from 'discord.js';
import { intersection } from 'lodash';
import { Event, Plugin } from '../discord.decorators';
import { DiscordEvent } from '../interfaces/events.enum';
import { DiscordPlugin } from './plugin.class';

@Injectable()
@Plugin('Reactions')
export class ReactionsPlugin extends DiscordPlugin {
  private readonly reactions: Record<string, string[]> = {
    '🦆': ['duckie', 'duckies', 'ducky', 'duck', 'ducks'],
    '🙏': ['amber', 'ambersun', 'grace'],
    '620094030507802655': ['yikes'],
  };

  @Event(DiscordEvent.Message)
  async onMessage(_client: Client, message: Message) {
    const words = message.content.split(' ').map((w) => w.replace(/[^A-Za-z0-9]/g, '').toLowerCase());
    const mentioned = message.mentions.users.map((u) => u.username.toLowerCase());
    const candidates = [...words, ...mentioned];

    for (const emoji in this.reactions) {
      if (intersection(candidates, this.reactions[emoji]).length) {
        // Intentionally swallow errors generated by this; non-critical feature can fail silently.
        await message.react(emoji).catch((e) => e);
      }
    }
  }
}
