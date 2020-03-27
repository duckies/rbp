import { Process, Processor, OnQueueError, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { HttpService, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { FormSubmission } from './form-submission.entity';
import { Job } from 'bull';

export const classIdToColor = {
  1: 13081710,
  2: 16092346,
  3: 11129457,
  4: 16774505,
  5: 16777215,
  6: 12853051,
  7: 28894,
  8: 4245483,
  9: 8882157,
  10: 65430,
  11: 16743690,
  12: 10694857,
};

export interface DiscordEmbed {
  title: string;
  color?: number | string;
  url?: string;
  description?: string;
  thumbnail?: { url: string };
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: Date;
  author?: { name: string; url?: string; icon_url?: string };
  footer?: { text: string; icon_url?: string };
  content?: string;
  username?: string;
  avatar_url?: string;
}

@Processor('form')
export class FormSubmissionQueue {
  private readonly logger: Logger = new Logger(FormSubmissionQueue.name);

  constructor(private readonly http: HttpService, private readonly config: ConfigService) {}

  @Process({ name: 'newApplication', concurrency: 1 })
  private async sendSubmissionWebhook(job: Job<FormSubmission>) {
    const main = job.data.characters[0];
    const color =
      main && main.class_id && main.class_id in classIdToColor ? classIdToColor[main.class_id] : 12790015;
    const title = main.class_name
      ? `New ${main.class_name} Application: ${main.name}`
      : `New Application: ${main.name}`;

    const embed: DiscordEmbed = {
      title,
      color,
      url: `${this.config.get('BASE_URL')}/applications/${main.id}`,
      description: 'An application was submitted to the guild website.',
      fields: [],
      timestamp: job.data.createdAt,
      username: job.data.author.discord_username,
      avatar_url: job.data.author.discord_avatar
        ? `https://cdn.discordapp.com/avatars/${job.data.author.discord_id}/${
            job.data.author.discord_avatar
          }${job.data.author.discord_avatar.includes('a_') ? '.gif' : '.png'}`
        : undefined,
    };

    if (main.avatar_url) {
      embed.thumbnail = {
        url: main.avatar_url,
      };
    }

    if ((main.raiderIO && main.raiderIO.gear) || main.equipped_item_level) {
      const heartSlot = main.equipment ? main.equipment.find(slot => slot.item.id === 158075) : null;
      const heart = heartSlot ? heartSlot.azerite_details : null;
      const legendSlot = main.equipment ? main.equipment.find(slot => slot.item.id === 169223) : null;
      const legendRank = legendSlot ? legendSlot.name_description.display_string : null;

      embed.fields.push({
        name: 'Gear',
        value: `${main.equipped_item_level ||
          main.raiderIO.gear.item_level_equipped} Equipped\n${main.average_item_level ||
          main.raiderIO.gear.item_level_total} Average\n${
          heart ? 'Neck Level ' + heart.level.value + '\n' : ''
        }${legendRank ? 'Cloak ' + legendRank + '\n' : ''}`,
        inline: true,
      });
    }

    embed.fields.push({
      name: 'Progression',
      value: 'Not yet implemented',
      inline: true,
    });

    if (main.raiderIO && main.raiderIO.mythic_plus_scores_by_season) {
      const rankings = main.raiderIO.mythic_plus_scores_by_season.map(season => {
        const seasonNums = season.season.match(/\d+/);
        if (!season) return '';

        return `Season ${seasonNums[0]}: ${season.scores.all}`;
      });
      embed.fields.push({
        name: 'Raider.IO',
        value: rankings.join('\n'),
        inline: true,
      });
    }

    embed.fields.push({
      name: 'Links',
      value: `[Armory](http://www.worldofwarcraft.com/en-us/character/us/${main.realm}/${main.name}) | [Raider.IO](https://www.raider.io/characters/us/${main.realm}/${main.name}) | [WarcraftLogs](https://www.warcraftlogs.com/character/us/${main.realm}/${main.name})`,
    });

    this.http.post(this.config.get('DISCORD_APP_WEBHOOK'), { embeds: [embed] }).toPromise();
  }

  @OnQueueError()
  private onError(error: Error): void {
    this.logger.error(error);
  }

  @OnQueueFailed()
  private onFailed(_job: Job<number>, error: Error): void {
    this.logger.error('Failed: ' + error);
  }

  @OnQueueCompleted()
  private onCompleted(): void {
    this.logger.log('Application webhook sent.');
  }
}
