import { NotFoundException } from '@nestjs/common';
import { GuildMember, Message, MessageEmbed } from 'discord.js';
import { TwitchStream } from '../../../twitch/interfaces/stream.interface';
import { TwitchUser } from '../../../twitch/interfaces/user.interface';
import { TwitchService } from '../../../twitch/twitch.service';
import { SettingsPlugin } from '../settings.plugin';

export class Stream {
  public id: string;
  public user?: TwitchUser;
  public stream?: TwitchStream;
  public message?: Message;

  constructor(
    public readonly name: string,
    public readonly member: GuildMember,
    private readonly twitch: TwitchService,
    private readonly settings: SettingsPlugin,
  ) {}

  /**
   * Populates the class with the user's id for stream lookup purposes.
   */
  private async getId() {
    if (this.id) return this.id;

    const user = await this.twitch.getUser(this.name);

    this.id = user.id;
    this.user = user;

    return this.id;
  }

  /**
   * Populates the class with the stream information or
   * removes it if the stream is now offline.
   */
  public async isOnline() {
    // Ensure we have the id.
    await this.getId();

    try {
      this.stream = await this.twitch.getStream(this.id);

      return await this.getEmbed();
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.stream = undefined;

        return;
      }

      throw error;
    }
  }

  /**
   * Retrieves the embed for announcing the Twitch stream.
   */
  public async getEmbed() {
    if (!this.stream) return;

    return new MessageEmbed({
      title: this.stream.title,
      url: `https://www.twitch.tv/${this.name}`,
      description: `<@${this.member.id}> is streaming!`,
      image: {
        url: this.stream.thumbnail_url
          .replace('{width}', '1024')
          .replace('{height}', '576'),
      },
      timestamp: new Date(this.stream.started_at),
      color: await this.settings.getEmbedColor(),
      footer: {
        text: this.member.user.tag,
        icon_url: this.member.user.avatarURL({ dynamic: true }),
      },
    });
  }

  /**
   * Data export for storing Twitch stream information in the database.
   */
  public export() {
    // return {
    //   channelId: this.message.channel.id,
    //   messageId: this.message.id,
    //   memberId: this.member.id,
    //   twitch: { name: this.name, url: `https://www.twitch.tv/${this.name}` },
    // };
  }
}
