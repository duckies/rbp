import { FilterQuery, FindOptions, Populate } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { GuildCharacter } from '../guild-character/character.entity';
import { CreateRaidIdentityDto } from './dto/create-raid-identity.dto';
import { FindRaidIdentityDto } from './dto/find-raid-identity.dto';
import { UpdateRaidIdentityDTO } from './dto/update-raid-identity.dto';
import { RaidIdentity } from './raid-identity.entity';

@Injectable()
export class RaidIdentityService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Creates a new guild identity.
   *
   * @param CreateGuildIdentityDTO
   */
  async create({ characterId, ...meta }: CreateRaidIdentityDto) {
    const identity = this.em.create(RaidIdentity, meta);

    if (characterId) {
      identity.character = this.em.getReference(GuildCharacter, characterId);
    }

    await this.em.persist(identity).flush();

    return identity;
  }

  findOne({ name, realm, region }: FindRaidIdentityDto) {
    return this.em.findOneOrFail(RaidIdentity, {
      name,
      realm,
      region,
    });
  }

  findAll(
    where: FilterQuery<RaidIdentity>,
    options?: FindOptions<RaidIdentity>,
  ) {
    return this.em.findAndCount(RaidIdentity, where, options);
  }

  async update(
    { name, realm, region }: FindRaidIdentityDto,
    updateGuildIdentityDTO: UpdateRaidIdentityDTO,
  ) {
    const identity = await this.em.findOneOrFail(RaidIdentity, {
      name,
      realm,
      region,
    });

    this.em.assign(identity, updateGuildIdentityDTO);

    await this.em.flush();

    return identity;
  }

  async delete({ name, realm, region }: FindRaidIdentityDto) {
    const identity = await this.em.findOneOrFail(RaidIdentity, {
      name,
      realm,
      region,
    });

    await this.em.remove(identity).flush();
  }
}
