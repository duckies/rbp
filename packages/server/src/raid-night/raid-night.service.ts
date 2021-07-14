import {
  FilterQuery,
  FindOneOrFailOptions,
  FindOptions,
  wrap,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/knex';
import { Injectable } from '@nestjs/common';
import { Raid } from '../raid/raid.entity';
import { CreateRaidNightDto } from './dto/create-raid-night.dto';
import { UpdateRaidNightDto } from './dto/update-raid-night.dto';
import { RaidNight } from './raid-night.entity';

@Injectable()
export class RaidNightService {
  constructor(private readonly em: EntityManager) {}

  async create({ zone, ...meta }: CreateRaidNightDto) {
    const night = this.em.create(RaidNight, meta);

    if (zone) {
      night.raid = await this.em.findOneOrFail(Raid, zone);
      wrap(night.raid).populated();
    }

    await this.em.persist(night).flush();

    return night;
  }

  findOne(
    where: FilterQuery<RaidNight>,
    options?: FindOneOrFailOptions<RaidNight>,
  ) {
    return this.em.findOneOrFail(RaidNight, where, options);
  }

  findAll(where: FilterQuery<RaidNight>, options?: FindOptions<RaidNight>) {
    return this.em.findAndCount(RaidNight, where, options);
  }

  async update(
    where: FilterQuery<RaidNight>,
    { zone, ...meta }: UpdateRaidNightDto,
  ) {
    const night = await this.em.findOneOrFail(RaidNight, where);

    this.em.assign(night, meta);

    if (zone) {
      night.raid = await this.em.findOneOrFail(Raid, zone);
      wrap(night.raid).populated();
    }

    await this.em.flush();

    return night;
  }

  async delete(where: FilterQuery<RaidNight>) {
    const night = await this.em.findOneOrFail(RaidNight, where, {
      populate: true,
    });

    await this.em.remove(night).flush();
  }
}
