import {
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { HttpService, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ConfigService } from '../config/config.service';
import { FormSubmission } from './form-submission.entity';
import { DiscordWebhook } from './interfaces/discord-webhook.interface';

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

@Processor('form')
export class FormSubmissionQueue {
  private readonly logger: Logger = new Logger(FormSubmissionQueue.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  @Process({ name: 'new-application', concurrency: 1 })
  private async sendSubmissionWebhook(job: Job<FormSubmission>) {
    const main = job.data.characters[0];
    const color =
      main?.class.id in classIdToColor
        ? classIdToColor[main.class.id]
        : 12790015;
    const title = main.class.name
      ? `New ${main.class.name} Application: ${main.name}`
      : `New Application: ${main.name}`;

    const data: DiscordWebhook = {
      embeds: [
        {
          title,
          color,
          url: `${this.config.CLIENT_URL}/applications/${job.data.id}`,
          description: 'An application was submitted to the guild website.',
          fields: [],
          timestamp: job.data.createdAt,
        },
      ],
    };

    if (main.media) {
      data.embeds[0].thumbnail = {
        url: main.media.avatar,
      };
    }

    if ((main.raiderIO && main.raiderIO.gear) || main.equipped_item_level) {
      const heartSlot = main.equipment
        ? main.equipment.find((slot) => slot.item.id === 158075)
        : null;
      const heart = heartSlot ? heartSlot.azerite_details : null;
      const legendSlot = main.equipment
        ? main.equipment.find((slot) => slot.item.id === 169223)
        : null;
      const legendRank = legendSlot
        ? legendSlot.name_description.display_string
        : null;

      data.embeds[0].fields.push({
        name: 'Gear',
        value: `${
          main.equipped_item_level || main.raiderIO.gear.item_level_equipped
        } Equipped\n${
          main.average_item_level || main.raiderIO.gear.item_level_total
        } Average\n${heart ? 'Neck Level ' + heart.level.value + '\n' : ''}${
          legendRank ? 'Cloak ' + legendRank + '\n' : ''
        }`,
        inline: true,
      });
    }

    if (main.raiderIO?.mythic_plus_scores_by_season.length) {
      data.embeds[0].fields.push({
        name: 'Raider.IO',
        value: main.raiderIO.mythic_plus_scores_by_season
          .map((season) => {
            const seasonNum = season.season.match(/\d+/);

            if (!season) return '';

            const isPost = season.season.includes('post');

            return `Season ${seasonNum[0]}${isPost ? '.5' : ''}: ${
              season.scores.all
            }`;
          })
          .join('\n'),
        inline: true,
      });
    }

    if (main.raiderIO?.mythic_plus_best_runs.length) {
      data.embeds[0].fields.push({
        name: 'Best Dungeons',
        value: main.raiderIO?.mythic_plus_best_runs
          .map(
            (run) =>
              `${run.mythic_level} ${run.short_name} ${
                run.num_keystone_upgrades > 0
                  ? '+' + run.num_keystone_upgrades
                  : ''
              }`,
          )
          .join('\n'),
        inline: true,
      });
    }

    if (main.raids) {
      let progression = '';
      const lastExp = main.raids[main.raids.length - 1];

      for (const instance of lastExp.instances.slice(-4)) {
        const mythic = instance.modes.find(
          (m) => m.difficulty.type === 'MYTHIC',
        );

        if (mythic) {
          progression += `\n:crossed_swords: ${instance.instance.name} (${mythic.progress.completed_count}/${mythic.progress.total_count} M)`;
        }
      }
      data.embeds[0].fields.push({
        name: 'Recent Raids',
        value: progression,
        inline: false,
      });
    } else {
      data.embeds[0].fields.push({
        name: 'Progression',
        value: 'Data missing.',
        inline: true,
      });
    }

    data.embeds[0].fields.push({
      name: 'Links',
      value: `[Armory](http://www.worldofwarcraft.com/en-us/character/us/${main.realm}/${main.name}) | [Raider.IO](https://www.raider.io/characters/us/${main.realm}/${main.name}) | [WarcraftLogs](https://www.warcraftlogs.com/character/us/${main.realm}/${main.name})`,
    });

    const resp = await this.http
      .post(this.config.DISCORD.WEBHOOK, data)
      .toPromise();
  }

  @OnQueueError()
  private onError(error: Error): void {
    this.logger.error(error);
  }

  @OnQueueFailed()
  private onFailed(_job: Job<number>, error: Error): void {
    this.logger.error('Failed');
    console.error(error);
  }

  @OnQueueCompleted()
  private onCompleted(): void {
    this.logger.log('Application webhook sent.');
  }
}
