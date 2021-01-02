import {
  FilterQuery,
  Populate,
  QueryOrder,
  QueryOrderMap,
} from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ProfileService } from '../blizzard/services/profile/profile.service';
import { RaiderIOCharacterFields } from '../raiderIO/dto/char-fields.dto';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { GuildCharacter } from './character.entity';

@Injectable()
export class CharacterService {
  private readonly minCharacterLevel: number = this.config.get<number>(
    'MINIMUM_CHARACTER_LEVEL',
  );

  constructor(
    @InjectRepository(GuildCharacter)
    private readonly characterRepository: EntityRepository<GuildCharacter>,
    private readonly em: EntityManager,
    private readonly profileService: ProfileService,
    private readonly config: ConfigService,
    private readonly raiderIOService: RaiderIOService,
  ) {}

  /**
   * Creates a new guild member and populates them with basic information.
   *
   * @param findCharacterDto
   * @param rank
   */
  public async create({ name, realm, region }: FindCharacterDto, rank: number) {
    const guildCharacter = new GuildCharacter(name, realm, region);

    guildCharacter.guild_rank = rank;

    await this.populateGuildCharacter(guildCharacter);

    if (guildCharacter.level < this.minCharacterLevel) {
      throw new BadRequestException(
        `Below min level: ${this.minCharacterLevel}`,
      );
    }

    this.characterRepository.persist(guildCharacter);

    await this.characterRepository.flush();

    return guildCharacter;
  }

  public async populateGuildCharacter(guildCharacter: GuildCharacter) {
    const dto = guildCharacter.getFindCharacterDTO();

    const [
      summary,
      specialization,
      media,
      raiderIO,
    ] = await Promise.allSettled([
      this.profileService.getCharacterProfileSummary(dto),
      this.profileService.getCharacterSpecializationsSummary(dto),
      this.profileService.getCharacterMediaSummary(dto),
      this.raiderIOService.getCharacterRaiderIO(dto, [
        RaiderIOCharacterFields.MYTHIC_PLUS_SCORES_BY_CURRENT_AND_PREVIOUS_SEASON,
        RaiderIOCharacterFields.MYTHIC_PLUS_BEST_RUNS,
      ]),
    ]);

    if (summary.status === 'fulfilled') {
      guildCharacter.setCharacterProfileSummary(summary.value.data, this.em);
    }

    if (specialization.status === 'fulfilled') {
      guildCharacter.setCharacterSpecializationsSummary(
        specialization.value.data,
        this.em,
      );
    }

    if (media.status === 'fulfilled') {
      guildCharacter.setCharacterMediaSummary(media.value.data);
    }

    if (raiderIO.status === 'fulfilled') {
      guildCharacter.setCharacterRaiderIO(raiderIO.value);
    }

    return guildCharacter;
  }

  /**
   * Gets the guild roster by the wanted ranks.
   * Rank first and name alphabetized.
   * @param ranks
   */
  findRoster(ranks: number[] = [0, 1, 3, 4, 5]) {
    return this.characterRepository.find(
      { guild_rank: { $in: ranks } },
      {
        orderBy: { guild_rank: QueryOrder.ASC, name: QueryOrder.ASC },
      },
    );
  }

  /**
   * Retrieves all guild character given the specified query and pagination.
   * This method supports proxied MikroORM lookup features.
   */
  findAll(
    where: FilterQuery<GuildCharacter>,
    limit?: number,
    offset?: number,
    orderBy?: QueryOrderMap,
    populate?: Populate<GuildCharacter>,
  ) {
    return this.characterRepository.findAndCount(where, {
      limit,
      offset,
      orderBy,
      populate,
    });
  }

  /**
   * Finds a character from their id.
   * @param id
   */
  findById(id: number) {
    return this.characterRepository.findOne({ id });
  }

  findOneOrFail(
    where: FilterQuery<GuildCharacter>,
    populate?: Populate<GuildCharacter>,
    orderBy?: QueryOrderMap,
  ) {
    return this.characterRepository.findOneOrFail(where, populate, orderBy);
  }

  async delete(findCharacterDto: FindCharacterDto) {
    const character = await this.characterRepository.findOneOrFail(
      findCharacterDto,
    );

    return this.characterRepository.remove(character);
  }
}
