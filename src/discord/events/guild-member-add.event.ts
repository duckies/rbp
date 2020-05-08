import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { Client, GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { SubmissionService } from '../../form-submission/form-submission.service';
import { Cog } from '../discord.decorators';
import { Event } from '../interfaces/event.interface';
import { DiscordEvent } from '../interfaces/events.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
// @Cog.Event(DiscordEvent.GuildMemberAdd)
export class GuildMemberAddEvent implements Event {
  private readonly logger = new Logger(GuildMemberAddEvent.name);

  constructor(
    private readonly submissionService: SubmissionService,
    private readonly config: ConfigService,
  ) {}

  async execute(client: Client, member: GuildMember) {
    const submission = await this.submissionService.findOpenByUserDiscordID(member.id);
    const channel = client.channels.cache.get('443958062542356483');

    if (!channel || channel.type !== 'text') {
      this.logger.error('Channel was not found or is not a text channel.');
    }

    // When a submission exists, the user should be messaged that they will receive notifications.
    if (submission) {
      const embed = new MessageEmbed();
      embed.setColor(0xc328ff);
      embed.setTitle('Welcome Applicant');
      embed.setDescription(
        'Thank you for apply to Really Bad Players. So long as you remain in our Discord I will notify you of any changes made to your application. If you have any questions about the guild please message `Duckie`.',
      );
      embed.addField('Links', `[Application](${this.config.get('BASE_URL')}/applications/${submission.id})`);

      member.send(embed);

      await (channel as TextChannel).send(`Welcome applicant ${member}.`);
    } else {
      await (channel as TextChannel).send(`Welcome ${member}.`);
    }
  }
}
