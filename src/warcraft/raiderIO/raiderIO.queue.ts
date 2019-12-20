import { BadRequestException, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from 'nest-bull';
import { Raid } from '../raid/raid.entity';
import { RaidService } from '../raid/raid.service';
import { RaiderIOService } from './raiderIO.service';

@Processor({ name: 'raiderIO' })
export class RaiderIOQueue {
  private readonly logger: Logger = new Logger(RaiderIOQueue.name);

  constructor(private readonly raiderIOService: RaiderIOService, private readonly raidService: RaidService) {}

  @Process({ name: 'updateGuildRaiderIO' })
  private async updateGuildRaiderIO(job: Job<number>): Promise<Raid[]> {
    const guild = await this.raiderIOService.getGuildRaiderIO();

    // It's not worthwhile to commit to the update without all of the information.
    if (!guild.raid_progression || !guild.raid_rankings) {
      return Promise.reject(
        new BadRequestException({
          message: 'Missing data needed to complete guild update.',
          data: guild,
        }),
      );
    }

    let progress = 1;

    const slugs = Object.keys(guild.raid_progression);
    const lookupPromises = slugs.map(slug => this.raidService.findOneBySlug(slug));
    const raids: (Raid | Error)[] = await Promise.all(lookupPromises.map(p => p.catch(e => e)));
    const savePromises = [];

    for (let i = 0; i < raids.length; i++) {
      if (!(raids[i] instanceof Error)) {
        const raid = raids[i] as Raid;
        const raidProgress = guild.raid_progression[slugs[i]];
        const rankings = guild.raid_rankings[slugs[i]];

        raid.summary = raidProgress.summary;
        raid.bosses = raidProgress.total_bosses;
        raid.normalKilled = raidProgress.normal_bosses_killed;
        raid.heroicKilled = raidProgress.heroic_bosses_killed;
        raid.mythicKilled = raidProgress.mythic_bosses_killed;

        if (raid.mythicKilled > 0) {
          raid.world = rankings.mythic.world;
          raid.region = rankings.mythic.region;
          raid.realm = rankings.mythic.realm;

          raid.difficulty = 'Mythic';
          raid.progress = raidProgress.mythic_bosses_killed / raidProgress.total_bosses;
        } else if (raid.heroicKilled > 0) {
          raid.world = rankings.heroic.world;
          raid.region = rankings.heroic.region;
          raid.realm = rankings.heroic.realm;

          raid.difficulty = 'Heroic';
          raid.progress = raidProgress.heroic_bosses_killed / raidProgress.total_bosses;
        } else {
          raid.world = rankings.normal.world;
          raid.region = rankings.normal.region;
          raid.realm = rankings.normal.realm;

          raid.difficulty = 'Normal';
          raid.progress = raidProgress.normal_bosses_killed / raidProgress.total_bosses;
        }

        savePromises.push(raid.save());
      } else {
        this.logger.log(`Raid error: ${raids[i]}`);
      }
    }

    savePromises.forEach(p => p.then(() => job.progress(progress++ / savePromises.length)));

    return Promise.all(savePromises);
  }

  @OnQueueFailed()
  private onFailed(job: Job<number>, error): void {
    this.logger.log(`Job ${job.id} failed.`);
    this.logger.error(error);
  }

  @OnQueueCompleted()
  private onCompleted(job: Job<number>, result): void {
    if (job.name === 'updateGuildRaiderIO') {
      this.logger.log(`Raid Progression updated for ${result.length} raids.`);
    }
  }
}
