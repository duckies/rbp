import {
  FilterQuery,
  FindOneOrFailOptions,
  FindOptions,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RaidIdentity } from '../raid-identity/raid-identity.entity';
import { RaidNight } from '../raid-night/raid-night.entity';
import { CreateRaidIdentityStatusDto } from './dto/create-raid-identity-status.dto';
import { UpdateRaidIdentityStatusDto } from './dto/update-raid-identity-status.dto';
import { RaidIdentityStatus } from './raid-identity-status.entity';

@Injectable()
export class RaidIdentityStatusService {
  constructor(private readonly em: EntityManager) {}

  async create(
    nightId: number,
    { identity, ...meta }: CreateRaidIdentityStatusDto,
  ) {
    const status = this.em.create(RaidIdentityStatus, meta);

    status.raidNight = this.em.getReference(RaidNight, nightId);
    status.identity = await this.em.findOneOrFail(RaidIdentity, {
      name: identity.name,
      realm: identity.realm,
      region: identity.region,
    });

    await this.em.persist(status).flush();

    return status;
  }

  findOne(
    where: FilterQuery<RaidIdentityStatus>,
    options?: FindOneOrFailOptions<RaidIdentityStatus, any>,
  ) {
    return this.em.findOneOrFail(RaidIdentityStatus, where, options);
  }

  findAll(
    where: FilterQuery<RaidIdentityStatus>,
    options?: FindOptions<RaidIdentityStatus, any>,
  ) {
    return this.em.findAndCount(RaidIdentityStatus, where, options);
  }

  async update(
    where: FilterQuery<RaidIdentityStatus>,
    updateRaidIdentityStatusDto: UpdateRaidIdentityStatusDto,
  ) {
    const status = await this.em.findOneOrFail(RaidIdentityStatus, where);

    this.em.assign(status, updateRaidIdentityStatusDto);

    await this.em.flush();

    return status;
  }

  async delete(where: FilterQuery<RaidIdentityStatus>) {
    const status = await this.em.findOneOrFail(RaidIdentityStatus, where, {
      populate: true,
    });

    await this.em.remove(status).flush();
  }
}
