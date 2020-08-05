import {
  Client,
  Message,
  MessageAdditions,
  MessageEmbed,
  MessageOptions,
  SplitOptions,
} from 'discord.js';
import { PluginMap } from './discord.service';

export class Context {
  private readonly emojis = ['⬅️', '➡️'];

  constructor(
    public readonly client: Client,
    public readonly prefix: string,
    public readonly message: Message,
    public readonly plugins: Map<string, PluginMap>,
  ) {}

  /**
   * Instructs the bot to add a checkmark emoji to the initiating command.
   */
  async tick() {
    await this.message.react('✅');
  }

  async send(
    content: any,
    options?:
      | MessageOptions
      | (MessageOptions & { split?: false })
      | MessageAdditions
      | (MessageOptions & { split: true | SplitOptions }),
  ): Promise<Message> {
    return this.message.channel.send(content, options);
  }

  async paginate(embeds: MessageEmbed[], timeout = 120000) {
    let page = 0;

    const currentPage = await this.send(embeds[page]);

    for (const emoji of this.emojis) await currentPage.react(emoji);

    const collector = currentPage.createReactionCollector(
      (reaction, user) =>
        this.emojis.includes(reaction.emoji.name) && !user.bot,
      { time: timeout },
    );

    collector.on('collect', async (reaction) => {
      reaction.users.remove(this.message.author);

      switch (reaction.emoji.name) {
        case this.emojis[0]:
          page = page > 0 ? --page : embeds.length - 1;
          break;

        case this.emojis[1]:
          page = page + 1 < embeds.length ? ++page : 0;
          break;

        default:
          break;
      }

      await currentPage.edit(embeds[page]);
    });

    collector.on('end', () => currentPage.reactions.removeAll());

    return currentPage;
  }
}
