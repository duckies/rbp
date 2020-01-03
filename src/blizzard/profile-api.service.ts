import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { FindCharacterDto } from './dto/find-character.dto';
import { FindGuildDto } from './dto/find-guild.dto';
import { CharacterEndpoints, GuildEndpoints } from './enum/profile-api.enum';
import * as IProfile from './interfaces';
import { BlizzardTokenCheck } from './interfaces/check-token.interface';
import { TokenService } from './token.service';
import { ProfileKnownCharacters } from './interfaces/profile/known-characters.interface';

export type ProfileEndpointReturnType = {
  [CharacterEndpoints.Achievements]: IProfile.ProfileAchievements;
  [CharacterEndpoints.Appearance]: IProfile.ProfileAppearance;
  [CharacterEndpoints.CollectionsIndex]: IProfile.ProfileCollectionsIndex;
  [CharacterEndpoints.Equipment]: IProfile.ProfileEquipment;
  [CharacterEndpoints.HunterPets]: void; // NYI
  [CharacterEndpoints.Index]: IProfile.ProfileCharacter;
  [CharacterEndpoints.KeystoneProfileIndex]: IProfile.ProfileKeystoneIndex;
  [CharacterEndpoints.KeystoneProfileSeason]: IProfile.ProfileKeystoneSeason;
  [CharacterEndpoints.Media]: IProfile.ProfileMedia;
  [CharacterEndpoints.MountsCollection]: IProfile.ProfileMountCollection;
  [CharacterEndpoints.PetsCollection]: IProfile.ProfilePetCollection;
  [CharacterEndpoints.PvPBracket]: void; // NYI
  [CharacterEndpoints.PvPSummary]: void; // NYI
  [CharacterEndpoints.Reputations]: IProfile.ProfileReputations;
  [CharacterEndpoints.Specializations]: IProfile.ProfileSpecializations;
  [CharacterEndpoints.Statistics]: IProfile.ProfileStatistics;
  [CharacterEndpoints.Status]: IProfile.ProfileStatus;
  [CharacterEndpoints.Titles]: IProfile.ProfileTitles;
};

export type GuildEndpointReturnType = {
  [GuildEndpoints.Achievements]: IProfile.ProfileGuildAchievements;
  [GuildEndpoints.Index]: IProfile.ProfileGuild;
  [GuildEndpoints.Roster]: IProfile.ProfileGuildRoster;
};

@Injectable()
export class ProfileApiService {
  constructor(private readonly tokenService: TokenService, private readonly http: HttpService) {}

  /**
   * Checks if the Blizzard user token is valid.
   * [Blizzard OAuth](https://develop.battle.net/documentation/guides/using-oauth)
   * @param token User token; expires within 24 hours of login.
   */
  async checkToken(user: User): Promise<BlizzardTokenCheck> {
    if (!user.blizzardtoken) {
      throw new BadRequestException('No token to validate.');
    }

    const uri = 'https://us.battle.net/oauth/check_token';

    return (await this.http.post(uri, null, { params: { token: user.blizzardtoken } }).toPromise()).data;
  }

  /**
   * Retrieves the list of owned WoW characters for a Battle.net account.
   * @param token User token; expires within 24 hours of login.
   */
  async getUserCharacters(token: string): Promise<ProfileKnownCharacters> {
    const uri = 'https://us.api.blizzard.com/wow/user/characters';

    return (await this.http.get(uri, { headers: { Authorization: `Bearer ${token}` } }).toPromise()).data;
  }

  /**
   * Retrieves an array of character endpoint data given an array of endpoints to retrieve.
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   * @param endpoints CharacterEndpoints
   */
  async getCharacterAggregate<K extends CharacterEndpoints>(
    findCharacterDto: FindCharacterDto,
    endpoints: K[],
  ): Promise<ProfileEndpointReturnType[K][]> {
    // Prevents retrieving multiple tokens if this is the first method called after app start.
    await this.tokenService.getToken();
    return Promise.all(endpoints.map(endpoint => this.getCharacterData(findCharacterDto, endpoint)));
  }

  /**
   * Character Achievements API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterAchievements(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileAchievements> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Achievements);
  }

  /**
   * Character Collections Index API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterCollections(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileCollectionsIndex> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.CollectionsIndex);
  }

  /**
   * Character Mounts Collection API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterMountsCollection(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileMountCollection> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.MountsCollection);
  }

  /**
   * Character Pets Collection API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterPetsCollection(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfilePetCollection> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.PetsCollection);
  }

  /**
   * Character Equipment API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterEquipment(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileEquipment> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Equipment);
  }

  /**
   * Character Media API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterMedia(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileMedia> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Media);
  }

  /**
   * Character Mythic Keystone Index API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterKeystoneIndex(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileKeystoneIndex> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.KeystoneProfileIndex);
  }

  /**
   * Character Mythic Keystone Season API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterKeystoneSeason(
    findCharacterDto: FindCharacterDto,
    season: number,
  ): Promise<IProfile.ProfileKeystoneSeason> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.KeystoneProfileSeason, season);
  }

  /**
   * Character API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacter(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileCharacter> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Index);
  }

  /**
   * Character Status API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterStatus(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileStatus> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Status);
  }

  // NYI PVP Bracket Statistics
  // NYI PVP Summary

  /**
   * Character Reputations API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterReputations(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileReputations> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Reputations);
  }

  /**
   * Character Statistics API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterStatistics(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileStatistics> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Statistics)
  }

  /**
   * Character Specializations API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterSpecializations(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileSpecializations> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Specializations);
  }

  /**
   * Character Titles API.
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterTitles(findCharacterDto: FindCharacterDto): Promise<IProfile.ProfileTitles> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Titles);
  }

  /**
   * Guild API Index.
   * @param findGuildDto Guild name slug, realm slug, and region.
   */
  getGuild(findGuildDto: FindGuildDto): Promise<IProfile.ProfileGuild> {
    return this.getGuildData(findGuildDto, GuildEndpoints.Index);
  }

  /**
   * Guild API Index.
   * @param findGuildDto Guild name slug, realm slug, and region.
   */
  getGuildAchievements(findGuildDto: FindGuildDto): Promise<IProfile.ProfileGuildAchievements> {
    return this.getGuildData(findGuildDto, GuildEndpoints.Achievements);
  }

  /**
   * Guild API Index.
   * @param findGuildDto Guild name slug, realm slug, and region.
   */
  getGuildRoster(findGuildDto: FindGuildDto): Promise<IProfile.ProfileGuildRoster> {
    return this.getGuildData(findGuildDto, GuildEndpoints.Roster);
  }

  /**
   * Generic method for retrieving character profile information.
   *
   * @param FindCharacterDto Character name, realm, region.
   * @param endpoint CharacterProfile endpoint.
   * @param param Parameter if the profile endpoint requires it.
   */
  private async getCharacterData<K extends CharacterEndpoints>(
    { name, realm, region }: FindCharacterDto,
    endpoint: K,
    param: string | number = '',
  ): Promise<ProfileEndpointReturnType[K]> {
    await this.tokenService.getToken();

    const api = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}${endpoint}${param}?namespace=profile-us&locale=en_US`;

    const data = (await this.http.get(api).toPromise()).data;

    if (endpoint === CharacterEndpoints.Equipment) {
      const itemIds = (data as IProfile.ProfileEquipment).equipped_items.map(slot => slot.item.id)
    }

    return data;
  }

  /**
   * Generic method for retrieving guild profile information.
   *
   * @param FindGuildDto Lowercase character name, realm slug, and region.
   * @param endpoint GuildEndpoint
   */
  public async getGuildData<T extends GuildEndpoints>(
    { name, realm, region }: FindGuildDto,
    endpoint: T,
  ): Promise<GuildEndpointReturnType[T]> {
    await this.tokenService.getToken();

    const api = `https://${region}.api.blizzard.com/data/wow/guild/${realm}/${name}${endpoint}?namespace=profile-us&locale=en_US`;

    return (await this.http.get(api).toPromise()).data;
  }
}
