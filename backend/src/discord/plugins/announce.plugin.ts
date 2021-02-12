import { Injectable } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';
import { PluginConfig } from '../discord-config.class';
import { Context } from '../discord.context';
import { Command, CommandGroup, Plugin } from '../discord.decorators';
import { DiscordService } from '../discord.service';
import { DiscordPlugin } from './plugin.class';

@Injectable()
@Plugin('Announcements')
export class AnnouncePlugin extends DiscordPlugin {
  private readonly config: PluginConfig<{
    link: string;
  }>;

  constructor(discordService: DiscordService) {
    super();
    this.config = discordService.getConfig(AnnouncePlugin.name);
    this.config.registerGuild({
      link: '',
    });
  }

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

  @Command({
    name: '',
  })
  @Command({
    name: 'setrecruitment',
    group: 'announce',
    description: 'Sets the recruitment announcement link.',
  })
  private async setRecruitmentMessage(ctx: Context, link: string) {
    await this.config.setGuild(ctx.guild, { link });

    await ctx.tick();
  }

  @Command({
    name: 'recruitment',
    group: 'announce',
    description: 'Posts the recruitment announcement message.',
  })
  private async postRecruitmentMessage(ctx: Context) {
    const { link } = await this.config.getGuild(ctx.guild);

    const embed = new MessageEmbed({
      title: 'Recruitment Bump',
      description: `Please assist in bumping our [recruitment post](${link}).`,
      color: await ctx.settings.getEmbedColor(),
    });

    await ctx.send(embed);
    await ctx.message.delete();
  }
}
