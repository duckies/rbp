import {
  BadRequestException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { LessThan, Repository } from 'typeorm';
import { CharacterResponse } from '../interfaces/character-response.interface';
import { ConfigService } from '../../config/config.service';
import { User } from '../../user/user.entity';
import { BlizzardService } from '../blizzard/blizzard.service';
import {
  CharacterFields,
  CharacterFieldsDto,
  CharacterLookupDto,
} from '../blizzard/dto/get-character.dto';
import { TokenService } from '../blizzard/token.service';
import { Character } from './character.entity';
import { RealmSlug, RealmName } from '../interfaces/realm.enum';
import { RealmSlugDictionary } from '../blizzard/realm.map';

export interface PurgeResult {
  flagged: number;
  deleted: number;
}

@Injectable()
export class CharacterService {
  private readonly setMainFields: CharacterFieldsDto = new CharacterFieldsDto([
    CharacterFields.Guild,
    CharacterFields.Items,
    CharacterFields.Mounts,
    CharacterFields.PVP,
    CharacterFields.Professions,
    CharacterFields.Progression,
    CharacterFields.Talents,
    CharacterFields.Titles,
  ]);
  private readonly minimumCharacterLevel: number = parseInt(
    this.configService.get('MINIMUM_CHARACTER_LEVEL'),
  );

  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    private readonly blizzardService: BlizzardService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly http: HttpService,
  ) {}

  /**
   * Inserts or updates a character by pulling data from Blizzard.
   *
   * @param characterLookupDto Character name, region, realm.
   * @param characterFieldsDto Character fields for insertion.
   * @param forceUpdate Bypasses lastUpdated field check.
   * @param inOurGuild Forces the character to be added to our guild.
   * @param rank Guild rank passed when doing a guild roster update.
   * @param user User to associate the character with.
   */
  async upsert(
    characterLookupDto: CharacterLookupDto,
    characterFieldsDto: CharacterFieldsDto,
    forceUpdate?: boolean,
    inOurGuild?: boolean,
    rank?: number,
    user?: User,
  ): Promise<Character> {
    const { name, region, realm } = characterLookupDto;

    let [character, data]: [Character, CharacterResponse] = await Promise.all([
      this.findOne(characterLookupDto),
      this.blizzardService.getCharacter(characterLookupDto, characterFieldsDto),
    ]);

    // We do not support including young characters or alts.
    if (data.level < this.minimumCharacterLevel) {
      throw new BadRequestException('Character level is below minimum.');
    }

    if (character) {
      character.missingSince = null;
      character.isDeleted = false;

      // If the lastModified field has not changed, there is no work to do.
      if (!forceUpdate && !character.isModifiedSince(data.lastModified)) {
        character.notUpdated = true;
        return character;
      }
    } else {
      character = new Character(name, data.realm, region);
    }

    // The guild master has a rank of 0, which is falsy.
    if (rank || rank === 0) {
      character.guildRank = rank;
    }

    if (user) {
      character.account = user;
    }

    if (inOurGuild) {
      character.guild = 'Really Bad Players';
    }

    return character.mergeWith(data).save();
  }

  /**
   * Gets the guild roster by the wanted ranks.
   * Rank first and name alphabetized.
   * @param ranks
   */
  findRoster(ranks: number[] = [0, 1, 3, 4, 5]): Promise<Character[]> {
    return this.characterRepository
      .createQueryBuilder('character')
      .where('character.guildRank IN (:...ranks)', {
        ranks,
      })
      .orderBy({
        'character.guildRank': 'ASC',
        'character.name': 'ASC',
      })
      .getMany();
  }

  findAllInGuild(): Promise<Character[]> {
    return this.characterRepository.find({
      where: { guild: 'Really Bad Players' },
    });
  }

  /**
   * Finds a character given the id, name, realm, and/or region.
   * This is a case-sensitive lookup!
   * @param characterLookupDto
   */
  findOne(characterLookupDto: CharacterLookupDto): Promise<Character> {
    const { name, region, realm } = characterLookupDto;

    return this.characterRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .andWhere('realm = :realm', { realm: RealmSlugDictionary[realm] })
      .andWhere('region = :region', { region })
      .getOne();
  }

  async getCharacter(
    region: string,
    realm: RealmSlug,
    name: string,
    fields: string[],
  ): Promise<any> {
    await this.tokenService.getToken();
    const api = `https://${region}.api.blizzard.com/wow/character/${realm}/${name}?fields=${fields}`;

    const resp = await this.http.get(api).toPromise();

    return resp.data;
  }

  async setMain(
    user: User,
    characterLookupDto: CharacterLookupDto,
  ): Promise<User> {
    const character = await this.upsert(
      characterLookupDto,
      this.setMainFields,
      true,
      null,
      null,
      user,
    );

    user.mainCharacter = character;

    if (!user.customAvatar) {
      user.avatar = character.avatar();
    }

    await user.save();

    // Causes a circular dependency.
    delete user.mainCharacter;

    return user;
  }

  async delete(characterLookupDto: CharacterLookupDto): Promise<Character> {
    const character = await this.findOne(characterLookupDto);

    if (!character) throw new NotFoundException();

    return this.characterRepository.remove(character);
  }

  /**
   * Flags characters in a state of error for 3 days as deleted.
   * Removes the character from the database after 7 days.
   * This runs sequentially due to overlap in logic.
   */
  async purgeRoster(): Promise<PurgeResult> {
    const flagDate = moment()
      .utc()
      .subtract(3, 'days')
      .toDate();

    const deleteDate = moment()
      .utc()
      .subtract(7, 'days')
      .toDate();

    const deleteResults = await this.characterRepository
      .createQueryBuilder()
      .delete()
      .from(Character)
      .where({ missingSince: LessThan(deleteDate) })
      .returning('id')
      .execute();

    const updateResults = await this.characterRepository
      .createQueryBuilder()
      .update(Character)
      .set({ isDeleted: true })
      .where({ missingSince: LessThan(flagDate) })
      .returning('id')
      .execute();

    return {
      flagged: updateResults.raw.length,
      deleted: deleteResults.raw.length,
    };
  }
}
