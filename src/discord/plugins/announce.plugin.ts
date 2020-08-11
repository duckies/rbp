import { Injectable } from '@nestjs/common';
import { Plugin, Command, CommandGroup } from '../discord.decorators';
import { DiscordPlugin } from './plugin.class';
import { Context } from '../discord.context';
import { MessageEmbed } from 'discord.js';

@Injectable()
@Plugin('Announcements')
export class AnnouncePlugin extends DiscordPlugin {
  @CommandGroup('announce')
  private group() {}

  @Command({
    name: 'welcome',
    group: 'announce',
    description: 'Posts the welcome announcement.',
  })
  private async postWelcomeMessage(ctx: Context) {
    const embed = new MessageEmbed({
      title: 'Welcome to Really Bad Players',
      description:
        'We are the worst adult gaming community that raids on the World of Warcraft Area-52 server. ',
      color: 0xff28b3,
      fields: [
        {
          name: 'Rules & Policies',
          value:
            'Our community is profane on the best of days, but we do not welcome toxic behaviors or solicitation. We have a more robust list of guild and server rules [on our website](https://www.reallybadplayers.wtf/about/rules).',
        },
        {
          name: 'Links & Resources',
          value:
            '• [Guild Website](https://www.reallybadplayers.wtf)\n• [WoWProgress](https://www.wowprogress.com/guild/us/area-52/Really+Bad+Players)\n• [WarcraftLogs](https://www.warcraftlogs.com/guild/reports-list/500023/)\n• [RaiderIO](https://raider.io/guilds/us/area-52/Really%20Bad%20Players)',
          inline: true,
        },
        {
          name: 'Interested in Joining?',
          value:
            'If you are interested Mythic+ or our sale runs, feel free to hang around the Discord. If you are looking to raid with us, check out our [application](https://www.reallybadplayers.wtf/apply).',
          inline: true,
        },
      ],
    });

    await ctx.send(embed);
  }

  @Command({
    name: 'roles',
    group: 'announce',
    description: 'Posts the role selection message.',
  })
  private async postRoleMessage(ctx: Context) {
    const embed = new MessageEmbed({
      title: 'Select a Class Color',
      description:
        'If you wish to represent your class on Discord, feel free to use this to override the default role colors.',
      color: 0xff28b3,
    });

    await ctx.send(embed);
  }
}
