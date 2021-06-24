import { Injectable } from '@nestjs/common';
import { template } from '../../../app.utils';
import { HttpService } from '../../../http/http.service';
import { BlizzardService } from '../../blizzard.service';
import { FindCharacterDto } from '../../dto/find-character.dto';
import { AssetType } from '../../enums/asset-type.enum';
import { ProfileEndpoint } from '../../enums/profile-api.enum';
import * as Profile from '../../interfaces/profile';
import { GameDataService } from '../game-data/game-data.service';

export interface ProfileParams {
  realmId?: number;
  characterId?: number;
  seasonId?: number;
  pvpBracket?: number;
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly http: HttpService,
    private readonly gameDataService: GameDataService,
    private readonly blizzardService: BlizzardService,
  ) {
    http.setLimits({
      autoStart: true,
      intervalCap: 100,
      interval: 1000,
    });
  }

  async getProtectedCharacterProfileSummary(
    realmId: number,
    characterId: number,
  ) {
    return this.http.get<Profile.ProtectedCharacterProfileSummary>(
      `/profile/user/wow/protected-character/${realmId}-${characterId}`,
    );
  }

  async getAccountCollectionsIndex() {
    return this.http.get<Profile.AccountCollectionsIndex>(
      '/profile/user/wow/collections',
    );
  }

  async getAccountMountsCollectionSummary() {
    return this.http.get<Profile.AccountMountsCollectionSummary>(
      '/profile/user/wow/collections/mounts',
    );
  }

  async getAccountPetsCollectionSummary() {
    return this.http.get<Profile.AccountPetsCollectionSummary>(
      '/profile/user/wow/collections/mounts',
    );
  }

  async getCharacterAchievementsSummary({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterAchievementsSummary>(
      ProfileEndpoint.CharacterAchievementsSummary.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterAchievementStatistics({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterAchievementStatistics>(
      ProfileEndpoint.CharacterAchievementStatistics.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterAppearanceSummary({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterAppearanceSummary>(
      ProfileEndpoint.CharacterAppearanceSummary.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterCollectionsIndex({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterCollectionsIndex>(
      ProfileEndpoint.CharacterCollectionsIndex.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterMountsCollectionSummary({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterMountsCollectionSummary>(
      ProfileEndpoint.CharacterMountsCollectionSummary.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name),
    );
  }

  async getCharacterPetsCollectionSummary({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterPetsCollectionSummary>(
      ProfileEndpoint.CharacterPetsCollectionSummary.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterRaids({ name, realm }: FindCharacterDto) {
    const endpoint = template(ProfileEndpoint.CharacterRaids, {
      realm,
      name: name.toLowerCase(),
    });

    return this.blizzardService.getProfile<Profile.CharacterRaids>(endpoint);
  }

  async getCharacterEquipmentSummary(
    { name, realm }: FindCharacterDto,
    cache = true,
  ) {
    const endpoint = template(ProfileEndpoint.CharacterEquipmentSummary, {
      realm,
      name: name.toLowerCase(),
    });

    const resp = await this.blizzardService.getProfile<Profile.CharacterEquipmentSummary>(
      endpoint,
    );

    if (cache) {
      resp.data.equipped_items = await Promise.all(
        resp.data.equipped_items.map(async (slot) => {
          try {
            const media = await this.gameDataService.getGameItemMedia(
              slot.item.id,
            );

            slot.media.assets = {
              key: AssetType.Icon,
              value: media.value,
            };

            return slot;
          } catch (error) {
            console.log('Profile Error', error);
            return slot;
          }
        }),
      );
    }

    return resp;
  }

  async getCharacterHunterPetsSummary({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterHunterPetsSummary>(
      ProfileEndpoint.CharacterHunterPetsSummary.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterMediaSummary({ name, realm }: FindCharacterDto) {
    const endpoint = template(ProfileEndpoint.CharacterMediaSummary, {
      realm,
      name: name.toLowerCase(),
    });

    return this.blizzardService.getProfile<Profile.CharacterMediaSummary>(
      endpoint,
    );
  }

  async getCharacterMythicKeystoneProfileIndex({
    name,
    realm,
  }: FindCharacterDto) {
    return this.http.get<Profile.CharacterMythicKeystoneProfileIndex>(
      ProfileEndpoint.CharacterMythicKeystoneProfileIndex.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name),
    );
  }

  async getCharacterMythicKeystoneSeasonDetails({
    name,
    realm,
  }: FindCharacterDto) {
    return this.http.get<Profile.CharacterMythicKeystoneSeasonDetails>(
      ProfileEndpoint.CharacterMythicKeystoneSeasonDetails.replace(
        '{realmSlug}',
        realm,
      ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterProfileSummary({ name, realm }: FindCharacterDto) {
    const endpoint = template(ProfileEndpoint.CharacterProfileSummary, {
      realm,
      name: name.toLowerCase(),
    });

    return this.blizzardService.getProfile<Profile.CharacterProfileSummary>(
      endpoint,
    );
  }

  async getCharacterProfileStatus(
    { name, realm }: FindCharacterDto,
    lastModified?: string,
  ) {
    const endpoint = template(ProfileEndpoint.CharacterProfileStatus, {
      realm,
      name: name.toLowerCase(),
    });
    const headers = lastModified
      ? { 'If-Modified-Since': lastModified }
      : undefined;

    return this.blizzardService.getProfile<Profile.CharacterProfileStatus>(
      endpoint,
      headers,
    );
  }

  async getCharacterPvPBracketStatistics({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterPvPBracketStatistics>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.CharacterPvPBracketStatistics.replace(
          '{realmSlug}',
          realm,
        ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterPvPSummary(
    { name, realm }: FindCharacterDto,
    pvpBracket: number,
  ) {
    return this.http.get<Profile.CharacterPvPSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.CharacterPvPSummary.replace('{realmSlug}', realm)
          .replace('{characterName}', name.toLowerCase())
          .replace('{pvpBracket}', pvpBracket.toString()),
    );
  }

  async getCharacterQuests({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterQuests>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.CharacterQuests.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterCompletedQuests({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterCompletedQuests>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.CharacterCompletedQuests.replace(
          '{realmSlug}',
          realm,
        ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterReputationsSummary({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterReputationsSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.CharacterReputationsSummary.replace(
          '{realmSlug}',
          realm,
        ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterSpecializationsSummary({ name, realm }: FindCharacterDto) {
    const endpoint = template(ProfileEndpoint.CharacterSpecializationsSummary, {
      realm,
      name: name.toLowerCase(),
    });

    return this.blizzardService.getProfile<Profile.CharacterSpecializationsSummary>(
      endpoint,
    );
  }

  async getCharacterStatisticsSummary({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterStatisticsSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.CharacterStatisticsSummary.replace(
          '{realmSlug}',
          realm,
        ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getCharacterTitlesSummary({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.CharacterTitlesSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.CharacterTitlesSummary.replace(
          '{realmSlug}',
          realm,
        ).replace('{characterName}', name.toLowerCase()),
    );
  }

  async getGuild({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.Guild>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.Guild.replace('{realmSlug}', realm).replace(
          '{nameSlug}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuildActivity({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.GuildActivity>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.GuildActivity.replace('{realmSlug}', realm).replace(
          '{nameSlug}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuildAchievements({ name, realm }: FindCharacterDto) {
    return this.http.get<Profile.GuildAchievements>(
      'https://us.api.blizzard.com' +
        ProfileEndpoint.GuildAchievements.replace('{realmSlug}', realm).replace(
          '{nameSlug}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuildRoster({ name, realm }: FindCharacterDto, min = 10) {
    const endpoint = template(ProfileEndpoint.GuildRoster, {
      realm,
      nameSlug: name.toLowerCase(),
    });

    const resp = await this.blizzardService.getProfile<Profile.GuildRoster>(
      endpoint,
    );

    resp.data.members = resp.data.members.filter(
      (m) => m.character.level >= min,
    );

    return resp;
  }
}
