import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { BadRequestException, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { Raid } from './raid.entity';
import { RaidService } from './raid.service';

@Processor('raid')
export class RaidQueue {
  private readonly logger: Logger = new Logger(RaidQueue.name);

  constructor(private readonly raidService: RaidService, private readonly raiderIOService: RaiderIOService) {}

  @Process({ name: 'updateRaids' })
  private async updateRaids(job: Job<number>): Promise<Raid[]> {
    const raiderIOData = await this.raiderIOService.getGuildRaiderIO();
    const raids = await this.raidService.findAllBySlugs(Object.keys(raiderIOData.raid_rankings));
    const promises = [];
    let progress = 0;

    if (!raiderIOData.raid_progression || !raiderIOData.raid_rankings) {
      throw new BadRequestException({
        message: 'No data available for RaiderIO guild update.',
        raiderIOData,
      });
    }

    for (const raidSlug of Object.keys(raiderIOData.raid_rankings)) {
      let raid = raids.find((r) => r.slug === raidSlug);

      if (!raid) {
        raid = new Raid();
        raid.slug = raidSlug;
      } else if (raid.locked) {
        continue;
      }

      raid.summary = raiderIOData.raid_progression[raid.slug].summary;
      raid.bosses = raiderIOData.raid_progression[raid.slug].total_bosses;
      raid.normal_bosses_killed = raiderIOData.raid_progression[raid.slug].normal_bosses_killed;
      raid.heroic_bosses_killed = raiderIOData.raid_progression[raid.slug].heroic_bosses_killed;
      raid.mythic_bosses_killed = raiderIOData.raid_progression[raid.slug].mythic_bosses_killed;

      if (raiderIOData.raid_rankings[raid.slug].mythic.world > 0) {
        raid.difficulty = 'Mythic';
        raid.world = raiderIOData.raid_rankings[raid.slug].mythic.world;
        raid.region = raiderIOData.raid_rankings[raid.slug].mythic.region;
        raid.realm = raiderIOData.raid_rankings[raid.slug].mythic.realm;
        raid.progress = raid.mythic_bosses_killed / raid.bosses;
      } else if (raiderIOData.raid_rankings[raid.slug].heroic.world > 0) {
        raid.difficulty = 'Heroic';
        raid.world = raiderIOData.raid_rankings[raid.slug].heroic.world;
        raid.region = raiderIOData.raid_rankings[raid.slug].heroic.region;
        raid.realm = raiderIOData.raid_rankings[raid.slug].heroic.realm;
        raid.progress = raid.heroic_bosses_killed / raid.bosses;
      } else {
        raid.difficulty = 'Normal';
        raid.world = raiderIOData.raid_rankings[raid.slug].normal.world;
        raid.region = raiderIOData.raid_rankings[raid.slug].normal.region;
        raid.realm = raiderIOData.raid_rankings[raid.slug].normal.realm;
        raid.progress = raid.normal_bosses_killed / raid.bosses;
      }

      promises.push(this.raidService.upsert(raid));
    }

    promises.forEach((p) => p.then(() => job.progress(progress++ / promises.length)));

    return Promise.all(promises);
  }

  @OnQueueError()
  private onError(_job: Job<number>, error: Error): void {
    this.logger.error(error);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<number>, result: Raid[]): void {
    this.logger.log(`Roster update completed for ${result.length} raids.`);
  }

  @OnQueueFailed()
  private onFailed(job: Job<number>, error: Error): void {
    this.logger.error(`Job[${job.id}] failed: ${JSON.stringify(error.message)}`);
  }
}
