import { HttpService, Injectable, BadRequestException } from '@nestjs/common';
import KnownCharacter from '../../user/interfaces/known-character.interface';
import { User } from '../../user/user.entity';
import { CharacterLookupDto } from '../dto/get-character.dto';
import { GuildLookupDto } from '../dto/guild-lookup.dto';
import { CharacterResponse } from '../interfaces/character-response.interface';
import GuildResponse from '../interfaces/guild.interface';
import { BlizzardTokenCheck } from './interfaces/check-token.interface';
import { TokenService } from './token.service';
import { FindCharacterDto } from '../character/dto/find-character.dto';
import { ProfileAchievements } from './interfaces/profile-achievements.interface';
import { ProfileCollectionsIndex } from './interfaces/profile-collections-index.interface';
import { ProfileMountCollection } from './interfaces/profile-mounts.interface';
import { ProfilePetCollection } from './interfaces/profile-pets.interface';

export enum CharacterProfile {
  Achievements = 'achievements',
  Appearance = 'appearance',
  CollectionsIndex = 'collections',
  MountsCollection = 'collections/mount',
  PetsCollection = 'collections/pets',
  Equipment = 'equipment',
  HunterPets = 'hunter-pets',
  CharacterMedia = 'character-media',
  KeystoneProfileIndex = 'mythic-keystone-profile',
  KeystoneProfileSeason = 'mythic-keystone-profile/season/',
  Status = 'status',
  PvPBracket = 'pvp-bracket/',
  PvPSummary = 'pvp-summary',
  Reputations = 'reputations',
  Specializations = 'specializations',
  Statistics = 'statistics',
  Titles = 'titles',
}

@Injectable()
export class BlizzardService {
  constructor(private readonly tokenService: TokenService, private readonly http: HttpService) {}

  /**
   * Checks if the Blizzard user token is valid.
   * [Blizzard OAuth](https://develop.battle.net/documentation/guides/using-oauth)
   * @param token User token; expires within 24 hours of login.
   */
  async checkToken(token: string): Promise<BlizzardTokenCheck> {
    return (await this.http.post('https://us.battle.net/oauth/check_token', null, { params: { token } }).toPromise())
      .data;
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
    // Potentially valid token and we're either forcing an update or not throttled.
    if (!user.tokenExpired() && (sync || (typeof sync === 'undefined' && !user.charactersUpdatedWithin(10)))) {
      try {
        await this.checkToken(user.blizzardtoken);
        await this.syncUserCharacters(user);
      } catch (error) {
        user.blizzardtoken = null;
        await user.save();
      }
    }

    return {
      blizzardTokenExpiration: user.blizzardTokenExpiration,
      knownCharacters: user.knownCharacters,
      knownCharactersLastUpdated: user.knownCharactersLastUpdated,
    };
  }

  async syncUserCharacters(user: User): Promise<Partial<User>> {
    const resp = await this.http
      .get('https://us.api.blizzard.com/wow/user/characters', {
        headers: { Authorization: `Bearer ${user.blizzardtoken}` },
      })
      .toPromise();

    const characters: KnownCharacter[] = resp.data.characters
      .filter((c: KnownCharacter) => c.level < 100)
      .sort((a: KnownCharacter, b: KnownCharacter) => b.level - a.level);

    user.knownCharacters = characters;
    user.knownCharactersLastUpdated = new Date();

    await user.save();

    return {
      knownCharacters: characters,
      knownCharactersLastUpdated: user.knownCharactersLastUpdated,
    };
  }

  getCharacterAchievements(findCharacterDto: FindCharacterDto): Promise<ProfileAchievements> {
    return this.getProfileData(findCharacterDto, CharacterProfile.Achievements);
  }

  getCharacterCollections(findCharacterDto: FindCharacterDto): Promise<ProfileCollectionsIndex> {
    return this.getProfileData(findCharacterDto, CharacterProfile.CollectionsIndex);
  }

  getCharacterMountsCollection(findCharacterDto: FindCharacterDto): Promise<ProfileMountCollection> {
    return this.getProfileData(findCharacterDto, CharacterProfile.MountsCollection);
  }

  getCharacterPetsCollection(findCharacterDto: FindCharacterDto): Promise<ProfilePetCollection> {
    return this.getProfileData(findCharacterDto, CharacterProfile.MountsCollection);
  }

  /**
   * Generic method for retrieving character profile information.
   *
   * @param findCharacterDto Character name, realm, region.
   * @param endpoint CharacterProfile endpoint.
   * @param param Parameter if the profile endpoint requires it.
   */
  async getProfileData(
    { name, realm, region }: FindCharacterDto,
    endpoint?: CharacterProfile,
    param?: string | number,
  ): Promise<any> {
    if ((endpoint === CharacterProfile.KeystoneProfileSeason || endpoint === CharacterProfile.PvPBracket) && !param) {
      throw new BadRequestException('Param is required.');
    }

    await this.tokenService.getToken();

    const endpointTack = typeof endpoint === 'undefined' ? '' : `/${endpoint}${param ? param : ''}`;
    const api = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}${endpointTack}?namespace=profile-us&locale=en_US`;

    return (await this.http.get(api).toPromise()).data;
  }

  async fetchCharacterProfile({ name, realm, region }: CharacterLookupDto): Promise<CharacterResponse> {
    await this.tokenService.getToken();

    const api = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}?namespace=profile-us&locale=en_US`;

    return (await this.http.get(api).toPromise()).data;
  }

  async fetchGuild({ name, realm, region }: GuildLookupDto): Promise<GuildResponse> {
    await this.tokenService.getToken();

    const api = `https://${region}.api.blizzard.com/data/wow/guild/${realm}/${name}/roster?namespace=profile-${region}&locale=en_US`;

    return (await this.http.get(api).toPromise()).data;
  }
}
