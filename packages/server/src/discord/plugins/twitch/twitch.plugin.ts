import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Client, MessageEmbed, Presence, Role, TextChannel } from 'discord.js';
import { TwitchService } from '../../../twitch/twitch.service';
import {
  ChannelMention,
  RoleMention,
} from '../../decorators/mention.decorator';
import { PluginConfig } from '../../discord-config.class';
import { Context } from '../../discord.context';
import { Command, CommandGroup, Event, Plugin } from '../../discord.decorators';
import { DiscordService } from '../../discord.service';
import { DiscordEvent } from '../../interfaces/events.enum';
import { DiscordPlugin } from '../plugin.class';
import { SettingsPlugin } from '../settings.plugin';
import { Stream } from './twitch-stream.class';

export interface TwitchGuildConfig {
  channel: string;
  roles: string[];
  streams: RawStream[];
}

export interface ActiveStream {
  messageId: string;
}

export interface RawStream {
  message: string;
  member: string;
  twitch: {
    name: string;
    url: string;
  };
}

export interface GuildStreams {
  [id: string]: Stream[];
}

@Injectable()
@Plugin('Twitch')
export class TwitchPlugin extends DiscordPlugin {
  private readonly logger = new Logger(TwitchPlugin.name);
  private readonly config: PluginConfig<TwitchGuildConfig>;
  private streams: GuildStreams = {};

  constructor(
    discord: DiscordService,
    private readonly twitch: TwitchService,
    private readonly settings: SettingsPlugin,
  ) {
    super();
    this.config = discord.getConfig(TwitchPlugin.name);
    this.config.registerGuild({ channel: '', roles: [], streams: [] });
  }

  @CommandGroup({
    name: 'twitch',
    description: 'Commands related to Twitch.tv',
  })
  twitchGroup() {}

  @Command({
    name: 'channel',
    group: 'twitch',
    description: 'Sets the channel to announce active streams to.',
    syntax: '<#channel>',
  })
  async setChannel(ctx: Context, @ChannelMention() channel: TextChannel) {
    if (channel.type !== 'text') {
      return ctx.send('Channel must be a text channel.');
    }

    if (
      !channel
        .permissionsFor(ctx.message.guild.me)
        .has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      return ctx.send(
        'I lack the permissions to either send messages or embeds to that channel.',
      );
    }

    await this.config.setGuild(ctx.message.guild, { channel: channel.id });

    await ctx.tick();
  }

  @Command({
    name: 'addrole',
    group: 'twitch',
    description: 'Adds a role to automatically scan for Twitch streams.',
    syntax: '<@role>',
  })
  async addRole(ctx: Context, @RoleMention() role: Role) {
    const { roles } = await this.config.getGuild(ctx.guild);

    const existing = roles.find((r) => r === role.id);

    if (existing) {
      return ctx.send('This role is already being tracked.');
    }

    roles.push(role.id);

    await this.config.setGuild(ctx.guild, { roles });

    return ctx.tick();
  }

  @Command({
    name: 'removerole',
    group: 'twitch',
    description:
      'Removes a role from being automatically scanned for Twitch streams.',
    syntax: '<@role>',
  })
  async removeRole(ctx: Context, @RoleMention() role: Role) {
    const { roles } = await this.config.getGuild(ctx.guild);

    const existing = roles.find((r) => r === role.id);

    if (!existing) {
      return ctx.send('This role was already not being tracked.');
    }

    const newRoles = roles.filter((r) => r !== role.id);

    await this.config.setGuild(ctx.guild, { roles: newRoles });

    return ctx.tick();
  }

  @Command({
    name: 'debug',
    group: 'twitch',
    description: 'Dumps the currently stored Twitch data.',
  })
  async debug(ctx: Context) {
    const config = await this.config.getGuild(ctx.guild);
    const embed = new MessageEmbed({
      title: 'Twitch Plugin Debug',
      color: await ctx.settings.getEmbedColor(),
      fields: [
        {
          name: 'Current recorded data',
          value: ctx.formatCode(config, 'JSON'),
        },
      ],
    });

    return ctx.send(embed);
  }

  @Event(DiscordEvent.PresenceUpdate)
  private async onPresenceUpdate(
    client: Client,
    _oldPresence: Presence,
    presence: Presence,
  ) {
    if (presence.user.bot || !presence.activities.length) return;

    const { channel: cid, roles } = await this.config.getGuild(presence.guild);

    if (!cid) return;

    const channel = presence.guild.channels.cache.get(cid);

    if (!channel) return;

    if (presence.member.roles.cache.some((r) => roles.includes(r.id))) {
    }
  }
  // private async onPresenceUpdate(
  //   client: Client,
  //   _oldPresence: Presence,
  //   presence: Presence,
  // ) {
  //   let shouldUpdate = false;

  //   if (presence.user.bot || !presence.activities.length) return;

  //   const { channel: cid } = await this.config.getGuildConfig(presence.guild);

  //   if (!cid) return;

  //   const channel = client.channels.cache.get(cid) as TextChannel;

  //   // Ideally, this is some kind of error that needs to be resolved.
  //   if (!channel || channel.type !== 'text') return;

  //   if (!(presence.guild.id in this.streams)) {
  //     await this.buildStreams(presence.guild);
  //   }

  //   for (const activity of presence.activities) {
  //     if (activity.name !== 'Twitch') continue;

  //     this.logger.log(
  //       `Adding new stream for ${presence.user.tag} to ${activity.url}`,
  //     );

  //     const name = this.getTwitchChannel(activity.url);

  //     // Check if the Twitch stream is already managed.
  //     if (this.streams[presence.guild.id].find((s) => s.name === name)) {
  //       this.logger.log(`Stream ${activity.url} already monitoring`);
  //       continue;
  //     }

  //     const stream = new Stream(
  //       name,
  //       presence.member,
  //       this.twitch,
  //       this.settings,
  //     );
  //     const embed = await stream.isOnline();

  //     if (!embed) {
  //       this.logger.log(`No stream generated for ${activity.url}, aborting`);
  //       continue;
  //     }

  //     stream.message = await channel.send(embed);

  //     this.streams[presence.guild.id].push(stream);
  //     shouldUpdate = true;
  //   }

  //   if (!shouldUpdate) return;

  //   await this.config.setGuild(presence.guild, {
  //     streams: this.streams[presence.guild.id].map((s) => s.export()),
  //   });
  // }

  /**
   * Constructs the stream classes from the available database information.
   */
  // private async buildStreams(guild: Guild) {
  //   const { streams } = await this.config.getGuildConfig(guild);
  //   const retval: Stream[] = [];

  //   // For checking if the guild member still exists.
  //   await guild.members.fetch();

  //   for (const rawStream of streams) {
  //     const member = guild.members.cache.get(rawStream.memberId);
  //     const channel = guild.channels.cache.get(
  //       rawStream.channelId,
  //     ) as TextChannel;

  //     if (!channel) continue;

  //     const message = (await channel.messages.fetch()).get(rawStream.messageId);

  //     if (!message) continue;

  //     const stream = new Stream(
  //       rawStream.twitch.name,
  //       member,
  //       this.twitch,
  //       this.settings,
  //     );
  //     stream.message = message;

  //     retval.push(stream);
  //   }

  //   // Streams that had issues (missing member, channel, or message) are removed.
  //   if (retval.length !== streams.length) {
  //     const streams = retval.map((s) => s.export());

  //     await this.config.setGuild(guild, { streams });
  //   }

  //   this.streams[guild.id] = retval;
  // }

  /**
   * Checks if any currently stored streams need to be removed
   * as they have gone offline.
   */
  // private async checkStreams(client: Client) {
  //   for (const [, guild] of client.guilds.cache) {
  //     const config = await this.config.getGuildConfig(guild);

  //     // No announcement channel was setup.
  //     if (!config.channel) continue;

  //     const channel = guild.channels.cache.get(config.channel);

  //     // Channel no longer exists or is invisible to the bot.
  //     if (!channel) continue;

  //     // Fetch guild members for embed data.
  //     await guild.members.fetch();

  //     if (!(guild.id in this.streams)) {
  //       await this.buildStreams(guild);
  //     }

  //     for (const stream of this.streams[guild.id]) {
  //       try {
  //         const embed = await stream.getEmbed();

  //         this.logger.log(`Editing stream ${stream.name}`);

  //         await stream.message.edit(embed);
  //       } catch (error) {
  //         if (error instanceof NotFoundException) {
  //           await stream.message.delete();
  //         }

  //         this.logger.error(error);

  //         throw error;
  //       }
  //     }
  //   }
  // }

  /**
   * Splits a Twitch stream URL to get the channel name.
   */
  private getTwitchChannel(url: string) {
    const name = url.split('/')[3];

    if (!name) {
      throw new InternalServerErrorException(
        `Unexpected channel split name undefined using ${url}`,
      );
    }

    return name;
  }

  // @Loop('StreamCheck')
  // private async loop(_client: Client) {
  //   while (true) {
  //     // await this.checkStreams(client).catch((e) => {
  //     //   console.error(e);
  //     //   this.logger.error(e);
  //     // });

  //     await sleep(300000);
  //   }
  // }
}
