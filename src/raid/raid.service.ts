import { Injectable } from '@nestjs/common';
import { EntityRepository, QueryOrder, wrap } from 'mikro-orm';
import { InjectRepository } from 'nestjs-mikro-orm';
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
   * @param createRaidDto
   */
  async create(createRaidDto: CreateRaidDto) {
    const raid = this.raidRepository.create(createRaidDto);

    await this.raidRepository.persistAndFlush(raid);

    return raid;
  }

  /**
   * Finds the latest raids and their progress.
   * @param take Takes only 10 most recent raids by default
   * @param skip Skips no raids by default
   */
  async findAll(limit = 10, offset = 0) {
    const [result, total] = await this.raidRepository.findAndCount(
      {},
      {
        orderBy: { id: QueryOrder.DESC },
        limit,
        offset,
      },
    );

    return { result, total };
  }

  /**
   * Retrieves all raids in an array of slugs.
   * @param slugs Array of raid slugs.
   */
  async findAllBySlugs(slugs: string[]) {
    return this.raidRepository.find({ slug: { $in: slugs } });
  }

  /**
   * Finds the latest featured raids. Primarily used for the homepage.
   * @param take Takes only 4 most recent featuerd raids by default.
   * @param offset Skips no raids by default.
   */
  async findAllFeatured(limit = 4, offset = 0) {
    const [result, total] = await this.raidRepository.findAndCount(
      { isFeatured: true },
      {
        orderBy: { order: QueryOrder.ASC },
        limit,
        offset,
      },
    );

    return { result, total };
  }

  /**
   * Returns the raid of the given id or fails.
   * @param id
   */
  findOne(id: number): Promise<Raid> {
    return this.raidRepository.findOneOrFail(id);
  }

  /**
   * Finds by raid slug for automated updating.
   * Does not throw failure exception.
   * @param slug
   */
  findOneBySlug(slug: string): Promise<Raid> {
    return this.raidRepository.findOne({ slug });
  }

  /**
   * Adding upsert functionality is not possible as we'd have to constantly
   * provide the human readable name, bloating functionality.
   * @param id Raid id.
   * @param updateRaidDto
   */
  async update(id: number, updateRaidDto: UpdateRaidDto): Promise<Raid> {
    const raid = await this.raidRepository.findOneOrFail(id);

    wrap(raid).assign(updateRaidDto);

    await this.raidRepository.flush();

    return raid;
  }

  /**
   * Persists a newly created raid or updates an already existing one.
   * @param raid
   */
  async upsert(raid: Raid) {
    await this.raidRepository.persistAndFlush(raid);

    return raid;
  }
}
