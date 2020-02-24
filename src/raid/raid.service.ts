import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Raid } from './raid.entity';
import { CreateRaidDto } from './dto/create-raid.dto';
import { UpdateRaidDto } from './dto/update-raid.dto';

@Injectable()
export class RaidService {
  constructor(
    @InjectRepository(Raid)
    private readonly repository: Repository<Raid>,
  ) {}

  /**
   * Creating a raid should be done manually as we have to provide the
   * human readable name, the Raider.IO api does not do this.
   * @param createRaidDto
   */
  create(createRaidDto: CreateRaidDto): Promise<Raid> {
    return this.repository.save(createRaidDto);
  }

  /**
   * Finds the latest raids and their progress.
   * @param take Takes only 10 most recent raids by default
   * @param skip Skips no raids by default
   */
  async findAll(take = 10, skip = 0): Promise<{ result: Raid[]; total: number }> {
    const [result, total] = await this.repository.findAndCount({
      order: { id: 'DESC' },
      take,
      skip,
    });

    return { result, total };
  }

  /**
   * Retrieves all raids in an array of slugs.
   * @param slugs Array of raid slugs.
   */
  async findAllBySlugs(slugs: string[]): Promise<Raid[]> {
    return this.repository.find({
      where: { slug: In(slugs) },
    });
  }

  /**
   * Finds the latest featured raids. Primarily used for the homepage.
   * @param take Takes only 4 most recent featuerd raids by default.
   * @param skip Skips no raids by default.
   */
  async findAllFeatured(take = 4, skip = 0): Promise<{ result: Raid[]; total: number }> {
    const [result, total] = await this.repository.findAndCount({
<<<<<<< HEAD
      order: { id: 'DESC' },
=======
      order: { order: 'ASC' },
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
      where: { isFeatured: true },
      take,
      skip,
    });

    return { result, total };
  }

  /**
   * Returns the raid of the given id or fails.
   * @param id
   */
  findOne(id: number): Promise<Raid> {
    return this.repository.findOneOrFail(id);
  }

  /**
   * Finds by raid slug for automated updating.
   * Does not throw failure exception.
   * @param slug
   */
  findOneBySlug(slug: string): Promise<Raid> {
    return this.repository.findOne({ slug });
  }

  /**
   * Adding upsert functionality is not possible as we'd have to constantly
   * provide the human readable name, bloating functionality.
   * @param id Raid id.
   * @param updateRaidDto
   */
  async update(id: number, updateRaidDto: UpdateRaidDto): Promise<Raid> {
    const raid = await this.repository.findOneOrFail(id);

    this.repository.merge(raid, updateRaidDto);

    return this.repository.save(raid);
  }
}
