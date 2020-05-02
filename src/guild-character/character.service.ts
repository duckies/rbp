import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityRepository, QueryOrder } from 'mikro-orm';
import moment from 'moment';
import { InjectRepository } from 'nestjs-mikro-orm';
import { BattleNetService } from '../blizzard/battle.net.service';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { ProfileService } from '../blizzard/profile.service';
import { User } from '../user/user.entity';
import { GuildCharacter } from './character.entity';

export interface PurgeResult {
  flagged: number;
  deleted: number;
}

@Injectable()
export class CharacterService {
  private readonly minimumCharacterLevel: number = this.config.get<number>('MINIMUM_CHARACTER_LEVEL');

  constructor(
    @InjectRepository(GuildCharacter)
    private readonly characterRepository: EntityRepository<GuildCharacter>,
    private readonly battleNetService: BattleNetService,
    private readonly profileService: ProfileService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Inserts or updates a character by pulling data from Blizzard.
   *
   * @param characterLookupDto Character name, region, realm.
   * @param rank Guild rank passed when doing a guild roster update.
   * @param id Optional id used to lookup a character.
   * @param user User to associate the character with.
   */
  async upsert(findCharacterDto: FindCharacterDto, rank: number, user?: User) {
    let [character, profileCharacter, profileMedia] = await Promise.all([
      this.findOne(findCharacterDto),
      this.profileService.getCharacterProfileSummary(findCharacterDto),
      this.profileService.getCharacterMediaSummary(findCharacterDto),
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
      character = new GuildCharacter();
      this.characterRepository.persistLater(character);
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

    await this.characterRepository.flush();

    return character;
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

  findAllInGuild() {
    return this.characterRepository.find({ guild_name: 'Really Bad Players' });
  }

  /**
   * Finds a character from their id.
   * @param id
   */
  findById(id: number) {
    return this.characterRepository.findOne({ id });
  }

  /**
   * Finds a character given the id, name, realm, and/or region.
   * This is a case-sensitive lookup!
   * @param characterLookupDto
   */
  findOne({ name, region, realm }: FindCharacterDto) {
    return this.characterRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(?)', [name])
      .andWhere('realm = ?', [realm])
      .andWhere('region = ?', [region])
      .getSingleResult();
  }

  // TODO: Re-create once Battle.net integration is achieved.
  // async setMain(user: User, findCharacterDto: FindCharacterDto) {
  //   const character = await this.upsert(findCharacterDto, null, user);

  //   user.mainCharacter = character;

  //   await user.save();

  //   // Causes a circular dependency.
  //   delete user.mainCharacter;

  //   return user;
  // }

  async delete(findCharacterDto: FindCharacterDto) {
    const character = await this.characterRepository.findOneOrFail(findCharacterDto);

    return this.characterRepository.remove(character);
  }

  /**
   * TODO: Re-create once Battle.net integration is achieved.
   * Retrieves the list of known characters owned by an account from the Blizzard OAuth flow.
   * Operates in three states depending on the sync argument:
   *    1. If sync is set to false, it will not fetch characters, only sending the current information.
   *    2. If sync is set to true, it will fetch characters always.
   *    3. If sync is undefined, it will fetch characters if the information is stale.
   * @param user User
   * @param sync Boolean
   */
  // async fetchKnownCharacters(user: User, sync?: boolean) {
  //   // Update for a potentially valid token and we're either forcing an update or not throttled.
  //   if (
  //     !user.tokenExpired() &&
  //     (sync || (typeof sync === 'undefined' && !user.charactersUpdatedWithin(10)))
  //   ) {
  //     try {
  //       await this.battleNetService.checkToken(user);
  //       await this.syncUserCharacters(user);
  //     } catch (error) {
  //       // We should handle authentication errors.
  //       console.error(error);
  //       // user.blizzardtoken = null;
  //       // await user.save();
  //     }
  //   }

  //   return {
  //     blizzardTokenExpiration: user.blizzardTokenExpiration,
  //     knownCharacters: user.knownCharacters,
  //     knownCharactersLastUpdated: user.knownCharactersLastUpdated,
  //   };
  // }

  // TODO: Re-create once Battle.net integration is achieved.
  // async syncUserCharacters(user: User) {
  //   const profile = await this.profileService.getAccountProfileSummary(user);

  //   const characters = profile.wow_accounts.map((a) => a.characters).flat();

  //   user.knownCharacters = characters;
  //   user.knownCharactersLastUpdated = new Date();

  //   await user.save();

  //   return {
  //     knownCharacters: characters,
  //     knownCharactersLastUpdated: user.knownCharactersLastUpdated,
  //   };
  // }

  async setCharactersMissing(characters: GuildCharacter[], date: Date) {
    for (const character of characters) {
      if (!character.missingSince) {
        character.missingSince = date;
      }
    }

    this.characterRepository.flush();
  }

  /**
   * Flags characters in a state of error for 3 days as deleted.
   * Removes the character from the database after 7 days.
   * This runs sequentially due to overlap in logic.
   */
  async purgeRoster() {
    const flagDate = moment().utc().subtract(3, 'days').toDate();
    const deleteDate = moment().utc().subtract(7, 'days').toDate();

    const deleteResults = await this.characterRepository
      .createQueryBuilder()
      .delete()
      .where({ missingSince: { $lt: deleteDate } })
      .getResult();

    const updateResults = await this.characterRepository
      .createQueryBuilder()
      .update({ isDeleted: true })
      .where({ missingSince: { $lt: flagDate } })
      .getResult();

    return {
      flagged: updateResults,
      deleted: deleteResults,
    };
  }
}
