import { FilterQuery, Populate } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/knex';
import { Injectable } from '@nestjs/common';
import { CreateRaidNightDTO } from './dto/create-raid-night.dto';
import { UpdateRaidNightDTO } from './dto/update-raid-night.dto';
import { RaidNight } from './entities/raid-night.entity';

@Injectable()
export class RaidNightService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Creates a new raid night with a given start and end time.
   */
  public async create(createRaidNightDto: CreateRaidNightDTO) {
    const raidNight = this.em.create(RaidNight, createRaidNightDto);

    await this.em.persist(raidNight).flush();

    return raidNight;
  }

  /**
   * Finds a specific raid night given a start and end time.
   */
  public findOne(where: FilterQuery<RaidNight>, populate: Populate<RaidNight>) {
    return this.em.findOneOrFail(RaidNight, where, {
      populate,
    });
  }

  /**
   * Paginates all raid nights for a given query.
   *
   * @param limit Raid nights to load.
   * @param offset Raid nights to skip.
   */
  public findAll(
    where: FilterQuery<RaidNight>,
    limit: number,
    offset: number,
    populate: Populate<RaidNight>,
  ) {
    return this.em.findAndCount(RaidNight, where, { populate, limit, offset });
  }

  /**
   * Updates a raid night for a given query.
   */
  public async update(
    where: FilterQuery<RaidNight>,
    updateRaidNightDto: UpdateRaidNightDTO,
    populate: Populate<RaidNight>,
  ) {
    const raidNight = await this.em.findOneOrFail(RaidNight, where, {
      populate,
    });

    this.em.assign(raidNight, updateRaidNightDto);

    await this.em.flush();

    return raidNight;
  }

  /**
   * Removes a specific raid night given a start and end time.
   */
  public async delete(where: FilterQuery<RaidNight>) {
    const raidNight = await this.em.findOneOrFail(RaidNight, where, {
      populate: true,
    });

    await this.em.remove(raidNight).flush();
  }
}
