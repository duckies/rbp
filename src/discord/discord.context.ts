import { Client, Message } from 'discord.js';

export class Context {
  constructor(
    public readonly client: Client,
    public readonly prefix: string,
    public readonly message: Message,
  ) {}

  async tick() {
    await this.message.react('✅');
  }
}
