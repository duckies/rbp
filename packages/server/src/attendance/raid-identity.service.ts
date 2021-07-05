import { FilterQuery, Populate } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { GuildCharacter } from '../guild-character/character.entity';
import { CreateRaidIdentityDTO } from './dto/create-raid-identity.dto';
import { FindRaidIdentityDTO } from './dto/find-raid-identity.dto';
import { UpdateRaidIdentityDTO } from './dto/update-raid-identity.dto';
import { RaidIdentity } from './entities/raid-identity.entity';

@Injectable()
export class RaidIdentityService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Creates a new raid identity.
   *
   * @param CreateRaidIdentityDTO
   */
  public async create({ characterId, ...meta }: CreateRaidIdentityDTO) {
    const identity = this.em.create(RaidIdentity, meta);

    if (characterId) {
      identity.character = this.em.getReference(GuildCharacter, characterId);
    }

    await this.em.persist(identity).flush();

    return identity;
  }

  public findOne({ name, realm, region }: FindRaidIdentityDTO) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    return this.em.findOneOrFail(RaidIdentity, {
      name,
      realm,
      region,
    });
  }

  public findAll(
    where: FilterQuery<RaidIdentity>,
    populate: Populate<RaidIdentity>,
    limit?: number,
    offset?: number,
  ) {
    return this.em.findAndCount(RaidIdentity, where, {
      populate,
      limit,
      offset,
    });
  }

  public async update(
    { name, realm, region }: FindRaidIdentityDTO,
    updateRaidIdentityDTO: UpdateRaidIdentityDTO,
  ) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const identity = await this.em.findOneOrFail(RaidIdentity, {
      name,
      realm,
      region,
    });

    this.em.assign(identity, updateRaidIdentityDTO);

    await this.em.flush();

    return identity;
  }

  public async delete({ name, realm, region }: FindRaidIdentityDTO) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const identity = await this.em.findOneOrFail(RaidIdentity, {
      name,
      realm,
      region,
    });

    await this.em.remove(identity).flush();
  }
}
