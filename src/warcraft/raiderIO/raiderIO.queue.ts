import { Queue, QueueProcess, OnQueueProgress, OnQueueCompleted, OnQueueFailed } from 'nest-bull';
import { Logger } from '@nestjs/common';
import { RaiderIOService } from './raiderIO.service';
import { Job } from 'bull';
import { RaidService } from '../raid/raid.service';
import { Raid } from '../raid/raid.entity';

@Queue({ name: 'raiderIO' })
export class RaiderIOQueue {
  private readonly logger: Logger = new Logger(RaiderIOQueue.name);

  constructor(
    private readonly raiderIOService: RaiderIOService,
    private readonly raidService: RaidService,
  ) {}

  @QueueProcess({ name: 'updateGuildRaiderIO' })
  private async updateGuildRaiderIO(job: Job<Number>): Promise<Raid[]> {
    const guild = await this.raiderIOService.getGuildRaiderIO();

    // It's not worthwhile to commit to the update without all of the information.
    if (!guild.raid_progression || !guild.raid_rankings)
      return Promise.reject({
        message: 'Missing data needed to complete guild update.',
        data: guild,
      });
    
    const promises: Promise<Raid>[] = [];
    let progress = 1;

    for (const slug in guild.raid_progression) {
      const raid = await this.raidService.findOneBySlug(slug);

      if (!raid) continue;

      const progress = guild.raid_progression[slug];
      const rankings = guild.raid_rankings[slug];

      raid.summary = progress.summary;
      raid.total_bosses = progress.total_bosses;
      raid.normal_bosses_killed = progress.normal_bosses_killed;
      raid.heroic_bosses_killed = progress.heroic_bosses_killed;
      raid.mythic_bosses_killed = progress.mythic_bosses_killed;

      if (raid.mythic_bosses_killed > 0) {
        raid.world = rankings.mythic.world;
        raid.region = rankings.mythic.region;
        raid.realm = rankings.mythic.realm;

        raid.difficulty = 'Mythic';
        raid.progress = progress.mythic_bosses_killed / progress.total_bosses;
      } else if (raid.heroic_bosses_killed > 0) {
        raid.world = rankings.heroic.world;
        raid.region = rankings.heroic.region;
        raid.realm = rankings.heroic.realm;

        raid.difficulty = 'Heroic';
        raid.progress = progress.heroic_bosses_killed / progress.total_bosses;
      } else {
        raid.world = rankings.normal.world;
        raid.region = rankings.normal.region;
        raid.realm = rankings.normal.realm;

        raid.difficulty = 'Normal';
        raid.progress = progress.normal_bosses_killed / progress.total_bosses;
      }

      promises.push(raid.save());
    }

    promises.forEach(p => p.then(() => job.progress(progress++ / promises.length)));

    return Promise.all(promises);
  }

  // @OnQueueProgress()
  // private onProgress(job: Job<Number>, progress: number): void {
  //   this.logger.log(`Job ${job.id} reports progress ${progress}`);
  // }

  @OnQueueFailed()
  private onFailed(job: Job<Number>, error): void {
    this.logger.log(`Job ${job.id} failed.`);
    this.logger.error(error);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<Number>, result): void {
    if (job.name === "updateGuildRaiderIO") {
      this.logger.log(`Raid Progression updated for ${result.length} raids.`)
    }
  }
}
