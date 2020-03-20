import { Process, Processor } from '@nestjs/bull';
import { HttpService, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { FormSubmission } from './form-submission.entity';

@Processor('form')
export class FormSubmissionQueue {
  private readonly logger: Logger = new Logger(FormSubmissionQueue.name);

  constructor(private readonly http: HttpService, private readonly config: ConfigService) {}

  @Process({ name: 'newApplication', concurrency: 1 })
  private async sendSubmissionWebhook(submission: FormSubmission) {
    this.http
      .post(this.config.get('DISCORD_APP_WEBHOOK'), {
        embeds: [
          {
            title: `New Application`,
            url: `${this.config.get('BASE_URL')}/applications/${submission.id}`,
            description:
              'An application was submitted to the guild website. Character information via Discord message is not yet implemented. Sorry, Beverly!',
          },
        ],
      })
      .toPromise();
  }
}
