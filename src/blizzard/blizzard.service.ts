import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import KnownCharacter from '../user/interfaces/known-character.interface';
import { FindCharacterDto } from './dto/find-character.dto';
import { FindGuildDto } from './dto/find-guild.dto';
import { CharacterEndpoints, GuildEndpoints } from './enum/profile-api.enum';
import * as ProfileAPI from './interfaces';
import { BlizzardTokenCheck } from './interfaces/check-token.interface';
import { TokenService } from './token.service';

@Injectable()
export class BlizzardService {
  constructor(private readonly tokenService: TokenService, private readonly http: HttpService) {}

  /**
   * Checks if the Blizzard user token is valid.
   * [Blizzard OAuth](https://develop.battle.net/documentation/guides/using-oauth)
   * @param token User token; expires within 24 hours of login.
   */
  async checkToken(token: string): Promise<BlizzardTokenCheck> {
    const uri = 'https://us.battle.net/oauth/check_token';

    return (await this.http.post(uri, null, { params: { token } }).toPromise()).data;
  }

  /**
   * Retrieves the list of owned WoW characters for a Battle.net account.
   * @param token User token; expires within 24 hours of login.
   */
  async getUserCharacters(token: string): Promise<KnownCharacter[]> {
    const uri = 'https://us.api.blizzard.com/wow/user/characters';

    return (await this.http.get(uri, { headers: { Authorization: `Bearer ${token}` } }).toPromise()).data;
  }

  getCharacterAggregate(findCharacterDto: FindCharacterDto, endpoints: CharacterEndpoints[]) {
    return Promise.all(endpoints.map(endpoint => this.getCharacterData(findCharacterDto, endpoint)));
  }

  /**
   * Character Achievements API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterAchievements(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileAchievements> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Achievements);
  }

  /**
   * Character Collections Index API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterCollections(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileCollectionsIndex> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.CollectionsIndex);
  }

  /**
   * Character Mounts Collection API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterMountsCollection(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileMountCollection> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.MountsCollection);
  }

  /**
   * Character Pets Collection API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterPetsCollection(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfilePetCollection> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.MountsCollection);
  }

  /**
   * Character Equipment API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterEquipment(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileEquipment> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Equipment);
  }

  /**
   * Character Media API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterMedia(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileMedia> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Media);
  }

  // NYI Mythic Keystone Profile Index
  // NYI Mythic Keystone Season Details

  /**
   * Character API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacter(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileCharacter> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Index);
  }

  /**
   * Character Status API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterStatus(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileStatus> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Status);
  }

  // NYI PVP Bracket Statistics
  // NYI PVP Summary
  // NYI Reputations Summary

  /**
   * Character Specializations API
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterSpecializations(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileSpecializations> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Status);
  }

  /**
   * Character Titles API.
   * @param findCharacterDto Character lowercase name, realm slug, and region.
   */
  getCharacterTitles(findCharacterDto: FindCharacterDto): Promise<ProfileAPI.ProfileTitles> {
    return this.getCharacterData(findCharacterDto, CharacterEndpoints.Titles);
  }

  /**
   * Guild API Index.
   * @param findGuildDto Guild name slug, realm slug, and region.
   */
  getGuild(findGuildDto: FindGuildDto): Promise<ProfileAPI.ProfileGuild> {
    return this.getGuildData(findGuildDto, GuildEndpoints.Index);
  }

  /**
   * Guild API Index.
   * @param findGuildDto Guild name slug, realm slug, and region.
   */
  getGuildAchievements(findGuildDto: FindGuildDto): Promise<ProfileAPI.ProfileGuildAchievements> {
    return this.getGuildData(findGuildDto, GuildEndpoints.Achievements);
  }

  /**
   * Guild API Index.
   * @param findGuildDto Guild name slug, realm slug, and region.
   */
  getGuildRoster(findGuildDto: FindGuildDto): Promise<ProfileAPI.ProfileGuildRoster> {
    return this.getGuildData(findGuildDto, GuildEndpoints.Roster);
  }

  /**
   * Generic method for retrieving character profile information.
   *
   * @param findCharacterDto Character name, realm, region.
   * @param endpoint CharacterProfile endpoint.
   * @param param Parameter if the profile endpoint requires it.
   */
  private async getCharacterData(
    { name, realm, region }: FindCharacterDto,
    endpoint: CharacterEndpoints,
    param: string | number = '',
  ): Promise<any> {
    // This is not robust.
    if (
      (endpoint === CharacterEndpoints.KeystoneProfileSeason || endpoint === CharacterEndpoints.PvPBracket) &&
      param === ''
    ) {
      throw new BadRequestException('Param is required.');
    }

    await this.tokenService.getToken();

    const api = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}${endpoint}${param}?namespace=profile-us&locale=en_US`;

    return (await this.http.get(api).toPromise()).data;
  }

  public async getGuildData({ name, realm, region }: FindGuildDto, endpoint: GuildEndpoints): Promise<any> {
    await this.tokenService.getToken();

    const api = `https://${region}.api.blizzard.com/data/wow/guild/${realm}/${name}${endpoint}?namespace=profile-us&locale=en_US`;

    return (await this.http.get(api).toPromise()).data;
  }
}
