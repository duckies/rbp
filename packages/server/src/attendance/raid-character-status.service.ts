import { FilterQuery, Populate } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateRaidCharacterStatusDTO } from './dto/create-raid-character-status.dto';
import { UpdateRaidCharacterStatusDTO } from './dto/update-raid-character-status.dto';
import { RaidCharacterStatus } from './entities/raid-character-status.entity';
import { RaidIdentity } from './entities/raid-identity.entity';
import { RaidNight } from './entities/raid-night.entity';

@Injectable()
export class RaidCharacterStatusService {
  constructor(private readonly em: EntityManager) {}

  public async create({
    identityId,
    raidNightId,
    ...meta
  }: CreateRaidCharacterStatusDTO) {
    const status = this.em.create(RaidCharacterStatus, meta);

    status.identity = this.em.getReference(RaidIdentity, identityId);
    status.raidNight = this.em.getReference(RaidNight, raidNightId);

    await this.em.persist(status).flush();

    return status;
  }

  public findOne(
    where: FilterQuery<RaidCharacterStatus>,
    populate: Populate<RaidCharacterStatus>,
  ) {
    return this.em.findOneOrFail(RaidCharacterStatus, where, { populate });
  }

  public async findAll(
    where: FilterQuery<RaidCharacterStatus>,
    populate: Populate<RaidCharacterStatus>,
    limit?: number,
    offset?: number,
  ) {
    return this.em.findAndCount(RaidCharacterStatus, where, {
      populate,
      limit,
      offset,
    });
  }

  public async update(
    where: FilterQuery<RaidCharacterStatus>,
    updateRaidCharacterStatusDTO: UpdateRaidCharacterStatusDTO,
  ) {
    const status = await this.em.findOneOrFail(RaidCharacterStatus, where);

    this.em.assign(status, updateRaidCharacterStatusDTO);

    await this.em.flush();

    return status;
  }

  public async delete(where: FilterQuery<RaidCharacterStatus>) {
    const status = await this.em.findOneOrFail(RaidCharacterStatus, where, {
      populate: true,
    });

    return this.em.remove(status).flush();
  }
}
