import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { GuildMember, MessageEmbed } from 'discord.js';
import { FormSubmissionStatus } from '../form-submission/enums/form-submission-status.enum';
import { FormSubmission } from '../form-submission/form-submission.entity';
import { SubmissionService } from '../form-submission/form-submission.service';
import { DiscordService } from './discord.service';

@Processor('discord')
export class DiscordQueue {
  private readonly logger = new Logger(DiscordQueue.name);

  constructor(
    private readonly submissionService: SubmissionService,
    private readonly discord: DiscordService,
    private readonly config: ConfigService,
  ) {}

  @Process({ name: 'APP_CREATE_NOTIFICATION' })
  private async sendCreateNotification(job: Job<FormSubmission>) {
    const member = await this.discord.getGuildMember(job.data.author.discord_id);

    const embed = new MessageEmbed();
    embed.setColor(0xc328ff);
    embed.setTitle('Thanks for the application!');
    embed.setDescription(
      `The guild was notified of your application and it is now under review.

      If the status of your application changes I will notify you so long as you remain in the *Really Bad Players* Discord.`,
    );
    embed.addField('Links', `[Application](${this.config.get('BASE_URL')}/applications/${job.data.id})`);

    await member.send(embed);

    this.logger.log(`Sent app. creation notification to ${member.nickname || member.displayName}.`);
  }

  @Process({ name: 'APP_STATUS_NOTIFICATION' })
  private async sendStatusNotification(job: Job<FormSubmission>) {
    const member = await this.discord.getGuildMember(job.data.author.discord_id);

    const embed = new MessageEmbed();
    embed.setColor(0xc328ff);

    if (job.data.status === FormSubmissionStatus.Approved) {
      embed.setTitle('Application Approved');
      embed.setDescription(
        `Your application was reviewed and you are approved to trial with the guild. If you haven't already discussed the timeline, or other questions you may have, with \`Duckie\` please do so we may get you into the raid as soon as possible.`,
      );
      embed.addField(
        'Notifications',
        'I will no longer notify you of any comments made to your application, but I will always be watching :skull_crossbones:',
      );
    } else if (job.data.status === FormSubmissionStatus.Cancelled) {
      embed.setTitle('Application Cancelled');
      embed.setDescription(
        `Either you or an officer has cancelled your application. You may submit another application in the future if you wish to do so. This may be the end, but perhaps also a new beginning? Regardless, I will no longer send you notifications.`,
      );
    } else if (job.data.status === FormSubmissionStatus.Rejected) {
      embed.setTitle('Application Rejected');
      embed.setDescription(`The officers have reviewed your application and have decided to reject it.`);
      embed.addField(
        `Reasoning`,
        `If you have not spoken with the officers, then this decision is likely the result of a lack of reliable logs, a conflict in raiding goals or mentality, or the inability to fit you into our current roster or progression goals. You are welcome to apply again in the future. If you have further questions please contact \`Duckies#1999\` on Discord.`,
      );
    }

    await member.send(embed);

    this.logger.log(
      `Sent app. status notification to ${member.nickname || member.displayName} with ${job.data.status}.`,
    );
  }

  @Process({ name: 'USER_JOINED' })
  private async sendJoinedAppNotification(job: Job<GuildMember>) {
    const submission = await this.submissionService.findOpenByUserDiscordID(job.data.id);

    if (submission) {
      const embed = new MessageEmbed();
      embed.setColor(0xc328ff);
      embed.setTitle('Welcome Applicant');
      embed.setDescription(
        'Thank you for apply to Really Bad Players. So long as you remain in our Discord I will notify you of any changes made to your application. If you have any questions about the guild please message `Duckie`.',
      );
      embed.addField('Links', `[Application](${this.config.get('BASE_URL')}/applications/${job.data.id})`);

      job.data.send(embed);
    }
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<any>) {
    this.logger.log(`Completed job ${job.name}`);
  }

  @OnQueueError()
  private onError(job: Job<any>, error: Error) {
    this.logger.error(`Job ${job.name} failure`);
    console.error(error);
  }

  @OnQueueFailed()
  private onFailed(job: Job<any>, error: Error) {
    this.logger.error(`Job ${job.name} failure`);
    console.error(error);
  }
}
