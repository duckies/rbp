import {
  FilterQuery,
  FindOptions,
  MikroORM,
  QueryOrder,
} from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RaiderIOService } from '../raider.io/raiderIO.service';
import { CreateRaidDto } from './dto/create-raid.dto';
import { UpdateRaidDto } from './dto/update-raid.dto';
import { Raid } from './raid.entity';

@Injectable()
export class RaidService {
  private readonly logger = new Logger(RaidService.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly raiderIOService: RaiderIOService,
  ) {}

  /**
   * Creating a raid should be done manually as we have to provide the
   * human readable name, the Raider.IO api does not do this.
   *
   * @param createRaidDto
   */
  public async create(createRaidDto: CreateRaidDto) {
    const raid = this.orm.em.create(Raid, createRaidDto);

    await this.orm.em.persist(raid).flush();

    return raid;
  }

  /**
   * Returns the raid of the given id or fails.
   *
   * @param id id of the raid
   */
  findOne(where: FilterQuery<Raid>) {
    return this.orm.em.findOneOrFail(Raid, where);
  }

  /**
   * Finds the latest raids and their progress.
   *
   * @param limit number of raids to retrieve
   * @param offset number of raids to offset by
   */
  findAll(
    where: FilterQuery<Raid>,
    options: FindOptions<Raid, any> = { limit: 10, offset: 0 },
  ) {
    return this.orm.em.findAndCount(Raid, where, options);
  }

  /**
   * Adding upsert functionality is not possible as we'd have to constantly
   * provide the human readable name, bloating functionality.
   *
   * @param id id of the raid entity to update
   * @param updateRaidDto properties to update within the raid entity
   */
  async update(where: FilterQuery<Raid>, updateRaidDto: UpdateRaidDto) {
    const raid = await this.orm.em.findOneOrFail(Raid, where);

    this.orm.em.assign(raid, updateRaidDto);

    await this.orm.em.flush();

    return raid;
  }

  @Cron(CronExpression.EVERY_HOUR)
  @UseRequestContext()
  private async scheduler() {
    this.logger.log('Running Raid Scheduler');
    try {
      const data = await this.raiderIOService.getGuildRaiderIO();

      if (!data.raid_progression || !data.raid_rankings) {
        throw new BadRequestException(
          'No data available for RaiderIO guild update.',
        );
      }

      const raids = await this.orm.em.find(Raid, {
        slug: { $in: Object.keys(data.raid_rankings) },
      });

      for (const slug of Object.keys(data.raid_rankings)) {
        let raid = raids.find((r) => r.slug === slug);

        if (!raid) {
          raid = new Raid();
          raid.slug = slug;

          this.orm.em.persist(raid);
        } else if (raid.locked) {
          continue;
        }

        raid.summary = data.raid_progression[raid.slug].summary;
        raid.bosses = data.raid_progression[raid.slug].total_bosses;
        raid.normal_bosses_killed =
          data.raid_progression[raid.slug].normal_bosses_killed;
        raid.heroic_bosses_killed =
          data.raid_progression[raid.slug].heroic_bosses_killed;
        raid.mythic_bosses_killed =
          data.raid_progression[raid.slug].mythic_bosses_killed;

        if (data.raid_rankings[raid.slug].mythic.world > 0) {
          raid.difficulty = 'Mythic';
          raid.world = data.raid_rankings[raid.slug].mythic.world;
          raid.region = data.raid_rankings[raid.slug].mythic.region;
          raid.realm = data.raid_rankings[raid.slug].mythic.realm;
          raid.progress = raid.mythic_bosses_killed / raid.bosses;
        } else if (data.raid_rankings[raid.slug].heroic.world > 0) {
          raid.difficulty = 'Heroic';
          raid.world = data.raid_rankings[raid.slug].heroic.world;
          raid.region = data.raid_rankings[raid.slug].heroic.region;
          raid.realm = data.raid_rankings[raid.slug].heroic.realm;
          raid.progress = raid.heroic_bosses_killed / raid.bosses;
        } else {
          raid.difficulty = 'Normal';
          raid.world = data.raid_rankings[raid.slug].normal.world;
          raid.region = data.raid_rankings[raid.slug].normal.region;
          raid.realm = data.raid_rankings[raid.slug].normal.realm;
          raid.progress = raid.normal_bosses_killed / raid.bosses;
        }
      }

      await this.orm.em.flush();

      this.logger.log(`Updated ${raids.length} raids.`);
    } catch (error) {
      this.logger.error(`Update failed: ${error.message}`);
    }
  }
}
