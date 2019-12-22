import { Logger, BadRequestException } from '@nestjs/common';
import { Process, Processor, OnQueueError, OnQueueCompleted, OnQueueFailed } from 'nest-bull';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { RaidService } from './raid.service';
import { Job } from 'bull';
import { Raid } from './raid.entity';

@Processor({ name: 'raid' })
export class RaidQueue {
  private readonly logger: Logger = new Logger(RaidQueue.name);

  constructor(private readonly raidService: RaidService, private readonly raiderIOService: RaiderIOService) {}

  @Process({ name: 'updateRaids' })
  private async updateRaids(job: Job<number>): Promise<Raid[]> {
    const data = await this.raiderIOService.getGuildRaiderIO();
    const raids = await this.raidService.findAllBySlugs(Object.keys(data.raid_rankings));
    const promises = [];
    let progress = 0;

    if (!data.raid_progression || !data.raid_rankings || !raids.length) {
      throw new BadRequestException({ message: 'Missing data for guild update.', data });
    }

    for (const raid of raids) {
      raid.summary = data.raid_progression[raid.slug].summary;
      raid.bosses = data.raid_progression[raid.slug].total_bosses;
      raid.normal_bosses_killed = data.raid_progression[raid.slug].normal_bosses_killed;
      raid.heroic_bosses_killed = data.raid_progression[raid.slug].heroic_bosses_killed;
      raid.mythic_bosses_killed = data.raid_progression[raid.slug].mythic_bosses_killed;

      raid.world = data.raid_rankings[raid.slug].mythic.world;
      raid.region = data.raid_rankings[raid.slug].mythic.region;
      raid.realm = data.raid_rankings[raid.slug].mythic.realm;
      raid.progress = raid.mythic_bosses_killed / raid.bosses;

      promises.push(raid.save());
    }

    promises.forEach(p => p.then(() => job.progress(progress++ / promises.length)));

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
