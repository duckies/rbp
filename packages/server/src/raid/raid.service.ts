import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateRaidDto } from './dto/create-raid.dto';
import { UpdateRaidDto } from './dto/update-raid.dto';
import { Raid } from './raid.entity';

@Injectable()
export class RaidService {
  constructor(
    @InjectRepository(Raid)
    private readonly raidRepository: EntityRepository<Raid>,
  ) {}

  /**
   * Creating a raid should be done manually as we have to provide the
   * human readable name, the Raider.IO api does not do this.
   *
   * @param createRaidDto
   */
  async create(createRaidDto: CreateRaidDto) {
    const raid = this.raidRepository.create(createRaidDto);

    await this.raidRepository.persistAndFlush(raid);

    return raid;
  }

  /**
   * Finds the latest raids and their progress.
   *
   * @param limit number of raids to retrieve
   * @param offset number of raids to offset by
   */
  async findAll(limit = 10, offset = 0) {
    return this.raidRepository.findAndCount(
      {},
      {
        orderBy: { id: QueryOrder.DESC },
        limit,
        offset,
      },
    );
  }

  /**
   * Retrieves all raids in an array of slugs.
   *
   * @param slugs array of raid slugs to retrieve
   */
  async findAllBySlugs(slugs: string[]) {
    return this.raidRepository.find({ slug: { $in: slugs } });
  }

  /**
   * Finds the latest featured raids. Primarily used for the homepage.
   *
   * @param limit number of raids to retrieve
   * @param offset number of raids to offset by
   */
  public findAllFeatured(limit = 4, offset = 0) {
    return this.raidRepository.findAndCount(
      { isFeatured: true },
      {
        orderBy: { order: QueryOrder.ASC },
        limit,
        offset,
      },
    );
  }

  /**
   * Returns the raid of the given id or fails.
   *
   * @param id id of the raid
   */
  findOne(id: number) {
    return this.raidRepository.findOneOrFail(id);
  }

  /**
   * Finds by raid slug for automated updating.
   * Does not throw failure exception.
   *
   * @param slug slug of the raid
   */
  findOneBySlug(slug: string) {
    return this.raidRepository.findOne({ slug });
  }

  /**
   * Adding upsert functionality is not possible as we'd have to constantly
   * provide the human readable name, bloating functionality.
   *
   * @param id id of the raid entity to update
   * @param updateRaidDto properties to update within the raid entity
   */
  async update(id: number, updateRaidDto: UpdateRaidDto) {
    const raid = await this.raidRepository.findOneOrFail(id);

    raid.assign(updateRaidDto);

    await this.raidRepository.flush();

    return raid;
  }
}
