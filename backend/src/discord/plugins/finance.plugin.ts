import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageEmbed } from 'discord.js';
import { IEX_TOKEN } from '../../app.constants';
import { Context } from '../discord.context';
import { Command, Plugin } from '../discord.decorators';
import { DiscordPlugin } from './plugin.class';

@Injectable()
@Plugin('Finance')
export class FinancePlugin extends DiscordPlugin {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  @Command({
    name: 'price',
    description: 'Shows the current price of a given stock',
  })
  async price(ctx: Context, stock: string) {
    try {
      const data = (
        await this.http
          .get(
            `https://cloud.iexapis.com/stable/stock/${stock}/quote?token=${this.config.get(
              IEX_TOKEN,
            )}`,
          )
          .toPromise()
      ).data;

      const embed = new MessageEmbed();
      embed.setTitle(`(${data.symbol}) ${data.companyName}`);
      embed.setColor(await ctx.settings.getEmbedColor());
      embed.setDescription(`Stock value $${data.latestPrice}.`);
      embed.addField('Change', `${data.change} ${data.changePercent * 100}%`);
      embed.setFooter(`${data.latestSource} at ${data.latestTime}`);

      await ctx.send(embed);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return await ctx.send('Unknown stock symbol, you idiot.');
        }
      }

      await ctx.send(
        'Void lords attacked this request, faggot 8-ball says try again later.',
      );
      console.error(error);
    }
  }
}
