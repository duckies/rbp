import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Guild, GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { sample } from 'lodash';
import moment from 'moment';
import { SubmissionService } from '../../form-submission/form-submission.service';
import { PluginConfig } from '../discord-config.class';
import { Context } from '../discord.context';
import { Command, CommandGroup, Event, Plugin } from '../discord.decorators';
import { DiscordService } from '../discord.service';
import { DiscordEvent } from '../interfaces/events.enum';
import { DiscordPlugin } from './plugin.class';

@Injectable()
@Plugin('Welcomer')
export class WelcomerPlugin extends DiscordPlugin {
  private readonly logger = new Logger(WelcomerPlugin.name);
  private readonly config: PluginConfig<{ channel: string; message: string; count: number; date: Date }>;
  private readonly goodbyeMessages = [
    '{username} is off to greener pastures.',
    '{username} became a born-again!',
    '{username} had their car broken into.',
    "{username} didn't like that one black joke.",
    '{username} found a married woman in an open relationship.',
  ];

  constructor(
    private readonly submissionService: SubmissionService,
    private readonly backendConfig: ConfigService,
    private readonly discordService: DiscordService,
  ) {
    super();
    this.config = discordService.getConfig(WelcomerPlugin.name);
    this.config.registerGuild({ channel: '', message: '', count: 0, date: new Date() });
  }

  @CommandGroup({ name: 'welcome' })
  welcome() {}

  @Command({ name: 'channel', group: 'welcome', description: 'Sets the welcome channel' })
  async setChannel(ctx: Context, cid: string) {
    const channel = ctx.message.guild.channels.cache.get(cid);

    if (!channel) {
      return await ctx.send('Cannot find the given channel id.');
    } else if (!channel.permissionsFor(ctx.message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) {
      return await ctx.send('Cannot send messages or embeds to this channel.');
    }

    await this.config.setGuild(ctx.message.guild, { channel: cid });

    await ctx.tick();
  }

  @Event(DiscordEvent.GuildMemberAdd)
  async onGuildMemberAdd(client: Client, member: GuildMember) {
    const { channel: cid } = await this.config.getGuild(member.guild);

    // Plugin is unitialized for the guild.
    if (!cid) return;

    const channel = client.channels.cache.get(cid);

    if (!channel || channel.type !== 'text') {
      return this.logger.error('Channel was not found or is not a text channel.');
    }

    const submission = await this.submissionService.findOpenByUserDiscordID(member.id);

    if (submission) {
      const embed = new MessageEmbed({
        title: 'Welcome Applicant',
        description:
          'Thank you for applying to Really Bad Players. So long as you remain in your Discord you will be notified of any changes made to your application. If you have any questions about your application or the guild, feel free to message the GM, Duckie.',
        color: 0xc328ff,
        fields: [
          {
            name: 'Links',
            value: `[Application](${this.backendConfig.get('BASE_URL')}/applications/${submission.id})`,
          },
        ],
      });

      member.send(embed);

      await this.sendWelcomeMessage(member.guild, channel as TextChannel, member, true);
    } else {
      await this.sendWelcomeMessage(member.guild, channel as TextChannel, member, false);
    }
  }

  @Event(DiscordEvent.GuildMemberRemove)
  async onGuildMemberRemove(client: Client, member: GuildMember) {
    const { channel: cid } = await this.config.getGuild(member.guild);

    // Plugin is unitialized for the guild.
    if (!cid) return;

    const channel = client.channels.cache.get(cid) as TextChannel;

    if (!channel || channel.type !== 'text') {
      return this.logger.error('Channel was not found or is not a text channel.');
    }

    await this.sendGoobyeMessage(channel, member);
  }

  private async sendWelcomeMessage(
    guild: Guild,
    channel: TextChannel,
    member: GuildMember,
    applicant: boolean,
  ) {
    const { count, date, message: mid } = await this.config.getGuild(guild);
    const resetCount = this.isYesterday(date);
    const newCount = resetCount || typeof count !== 'number' ? 1 : count + 1;

    // Remove the old welcome message, if possible.
    if (mid) {
      try {
        await channel.messages.cache.get(mid).delete({ reason: 'Removing old welcome message' });
      } catch (error) {
        // Intentionally ignoring this error.
      }
    }

    const message = await channel.send(
      `Welcome ${applicant ? 'applicant ' : ''}${member} to RBP, ${newCount} baddie${
        newCount > 1 ? 's' : ''
      } joined today.`,
    );

    await this.config.setGuild(guild, { count: newCount, date: new Date(), message: message.id });
  }

  @Command({ name: 'debug', group: 'welcome', description: 'Prints the current configuration.' })
  private async debug(ctx: Context) {
    await ctx.send(
      `**Guild**\n\`\`\`JSON\n${JSON.stringify(
        await this.config.getGuild(ctx.message.guild),
        null,
        2,
      )}\`\`\``,
    );
  }

  private async sendGoobyeMessage(channel: TextChannel, member: GuildMember) {
    const message = sample(this.goodbyeMessages).replace(
      '{username}',
      `${member.user.username}#${member.user.discriminator}`,
    );

    await channel.send(message);
  }

  private isYesterday(date: Date) {
    const yesterday = moment().subtract(1, 'day');

    return moment(date).isSame(yesterday, 'day');
  }
}
