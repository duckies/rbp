import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { LessThan, Repository, In } from 'typeorm';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ProfileApiService } from '../blizzard/profile-api.service';
import { ConfigService } from '../config/config.service';
import { KnownCharacter } from '../blizzard/interfaces/profile/known-characters.interface';
import { User } from '../user/user.entity';
import { Character } from './character.entity';

export interface PurgeResult {
  flagged: number;
  deleted: number;
}

@Injectable()
export class CharacterService {
  private readonly minimumCharacterLevel: number = parseInt(this.configService.get('MINIMUM_CHARACTER_LEVEL'), 10);

  constructor(
    @InjectRepository(Character)
    private readonly repository: Repository<Character>,
    private readonly blizzardService: ProfileApiService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Inserts or updates a character by pulling data from Blizzard.
   *
   * @param characterLookupDto Character name, region, realm.
   * @param rank Guild rank passed when doing a guild roster update.
   * @param user User to associate the character with.
   */
  async upsert(findCharacterDto: FindCharacterDto, rank: number, user?: User): Promise<Character> {
    // If the profile request(s) fail, there is no point in updating so let the error propagate.
    let [character, profileCharacter, profileMedia] = await Promise.all([
      this.repository.findOne(findCharacterDto),
      this.blizzardService.getCharacter(findCharacterDto),
      this.blizzardService.getCharacterMedia(findCharacterDto),
    ]);

    // We do not support underaged characters.
    if (profileCharacter.level < this.minimumCharacterLevel) {
      throw new BadRequestException(`Cannot store character below level ${this.minimumCharacterLevel}.`);
    }

    if (character) {
      character.missingSince = null;
      character.isDeleted = false;

      // If the "last_login_timestamp" field has not changed, there is no work to do.
      if (!character.isModifiedSince(profileCharacter.last_login_timestamp)) {
        character.notUpdated = true;
        return character;
      }
    } else {
      character = new Character();
    }

    // The guild master has a rank of 0, which is falsy.
    if (typeof rank !== 'undefined') {
      character.guild_rank = rank;
    }

    if (user) {
      character.account = user;
    }

    character.mergeProfileIndex(profileCharacter);
    character.mergeProfileMedia(profileMedia);

    return character.save();
  }

  /**
   * Gets the guild roster by the wanted ranks.
   * Rank first and name alphabetized.
   * @param ranks
   */
  findRoster(ranks: number[] = [0, 1, 3, 4, 5]): Promise<Character[]> {
    return this.repository.find({
      where: { guild_rank: In(ranks) },
      order: { guild_rank: 'ASC', name: 'ASC' },
    });
  }

  findAllInGuild(): Promise<Character[]> {
    return this.repository.find({
      where: { guild: 'Really Bad Players' },
    });
  }

  /**
   * Finds a character given the id, name, realm, and/or region.
   * This is a case-sensitive lookup!
   * @param characterLookupDto
   */
  findOne({ name, region, realm }: FindCharacterDto): Promise<Character> {
    return this.repository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .andWhere('realm = :realm', { realm })
      .andWhere('region = :region', { region })
      .getOne();
  }

  async setMain(user: User, findCharacterDto: FindCharacterDto): Promise<User> {
    const character = await this.upsert(findCharacterDto, null, user);

    user.mainCharacter = character;

    await user.save();

    // Causes a circular dependency.
    delete user.mainCharacter;

    return user;
  }

  async delete(findCharacterDto: FindCharacterDto): Promise<Character> {
    const character = await this.repository.findOneOrFail(findCharacterDto);

    return this.repository.remove(character);
  }

  /**
   * Retrieves the list of known characters owned by an account from the Blizzard OAuth flow.
   * Operates in three states depending on the sync argument:
   *    1. If sync is set to false, it will not fetch characters, only sending the current information.
   *    2. If sync is set to true, it will fetch characters always.
   *    3. If sync is undefined, it will fetch characters if the information is stale.
   * @param user User
   * @param sync Boolean
   */
  async fetchKnownCharacters(user: User, sync?: boolean): Promise<Partial<User>> {
    // Update for a potentially valid token and we're either forcing an update or not throttled.
    if (!user.tokenExpired() && (sync || (typeof sync === 'undefined' && !user.charactersUpdatedWithin(10)))) {
      console.log('Attempting to download characters.');
      try {
        await this.blizzardService.checkToken(user);
        await this.syncUserCharacters(user);
      } catch (error) {
        // We should handle authentication errors.
        console.error(error);
        // user.blizzardtoken = null;
        // await user.save();
      }
    }

    return {
      blizzardTokenExpiration: user.blizzardTokenExpiration,
      knownCharacters: user.knownCharacters,
      knownCharactersLastUpdated: user.knownCharactersLastUpdated,
    };
  }

  async syncUserCharacters(user: User): Promise<Partial<User>> {
    const knownCharacters = await this.blizzardService.getUserCharacters(user.blizzardtoken);

    const characters = knownCharacters.characters
      .filter(c => c.level >= this.minimumCharacterLevel)
      .sort((a, b) => b.level - a.level);

    user.knownCharacters = characters;
    user.knownCharactersLastUpdated = new Date();

    await user.save();

    return {
      knownCharacters: characters,
      knownCharactersLastUpdated: user.knownCharactersLastUpdated,
    };
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

    const deleteResults = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Character)
      .where({ missingSince: LessThan(deleteDate) })
      .returning('id')
      .execute();

    const updateResults = await this.repository
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
