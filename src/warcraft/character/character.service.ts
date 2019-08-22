import { Injectable, HttpService, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from './character.entity';
import {
  Repository,
  LessThan,
  MoreThan,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { FindCharacterDto } from './dto/find-character.dto';
import { TokenService } from '../blizzard/token.service';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { BlizzardService } from '../blizzard/blizzard.service';
import {
  CharacterLookupDto,
  CharacterFieldsDto,
  CharacterFields,
} from '../blizzard/dto/get-character.dto';
import { User } from '../../user/user.entity';
import { ConfigService } from '../../config/config.service';
import * as moment from 'moment';

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
    let [character, data] = await Promise.all([
      this.characterRepository.findOne(characterLookupDto),
      this.blizzardService.getCharacter(characterLookupDto, characterFieldsDto),
    ]);

    /**
     * Character retrieval failed.
     *
     */
    if (data instanceof Error) {
      // The character is in the database, so we need to update
      // that the character could not be retrieved.
      // console.log(data);
      if (character) {
        console.info('CHARACTER: ');
        console.log(character);
        character.missingSince = new Date();
        await character.save();
      }

      throw data;
    }

    // We do not support including characters below level 110.
    // Investigate if I should change this, not sure how I feel about it.
    if (data.level < this.minimumCharacterLevel) {
      throw new BadRequestException('Character level is below minimum.');
    }

    /***
     * If the character does not exist, they are new or were corrupted and deleted.
     * A new character is made and the fields which cannot be merged are added.
     */
    if (!character) {
      character = new Character(
        characterLookupDto.name,
        characterLookupDto.realm,
        characterLookupDto.region,
      );
    }

    character.missingSince = null;
    character.isDeleted = false;

    if (!forceUpdate && character.lastModified >= new Date(data.lastModified)) {
      character.notUpdated = true;
      return character;
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

    character.mergeWith(data);

    return character.save();
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

  /**
   * Finds a character given the id, name, realm, and/or region.
   * This is a case-sensitive lookup!
   * @param characterLookupDto
   */
  findOne(characterLookupDto: CharacterLookupDto): Promise<Character> {
    return this.characterRepository.findOne(characterLookupDto);
  }

  async getCharacter(
    region: string,
    realm: string,
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
    const character = await this.characterRepository.findOneOrFail(
      characterLookupDto,
    );

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
