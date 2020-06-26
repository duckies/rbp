import { Injectable } from '@nestjs/common';
import { User } from '../../../user/user.entity';
import { RateLimiter } from '../../blizzard.rate-limiter';
import { FindCharacterDto } from '../../dto/find-character.dto';
import { ProfileEndpoints } from '../../enums/profile-api.enum';
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
  constructor(private readonly rateLimiter: RateLimiter, private readonly gameDataService: GameDataService) {}

  async getAccountProfileSummary(user: User) {
    return this.rateLimiter.get<Profile.AccountProfileSummary>(
      'https://us.api.blizzard.com/profile/user/wow',
      null,
      user,
    );
  }

  async getProtectedCharacterProfileSummary(realmId: number, characterId: number) {
    return this.rateLimiter.get<Profile.ProtectedCharacterProfileSummary>(
      `https://us.api.blizzard.com/profile/user/wow/protected-character/${realmId}-${characterId}`,
    );
  }

  async getAccountCollectionsIndex() {
    return this.rateLimiter.get<Profile.AccountCollectionsIndex>(
      'https://us.api.blizzard.com/profile/user/wow/collections',
    );
  }

  async getAccountMountsCollectionSummary() {
    return this.rateLimiter.get<Profile.AccountMountsCollectionSummary>(
      'https://us.api.blizzard.com/profile/user/wow/collections/mounts',
    );
  }

  async getAccountPetsCollectionSummary() {
    return this.rateLimiter.get<Profile.AccountPetsCollectionSummary>(
      'https://us.api.blizzard.com/profile/user/wow/collections/mounts',
    );
  }

  async getCharacterAchievementsSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterAchievementsSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterAchievementsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterAchievementStatistics({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterAchievementStatistics>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterAchievementStatistics.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterAppearanceSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterAppearanceSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterAppearanceSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterCollectionsIndex({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterCollectionsIndex>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterCollectionsIndex.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterMountsCollectionSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterMountsCollectionSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMountsCollectionSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name,
        ),
    );
  }

  async getCharacterPetsCollectionSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterPetsCollectionSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterPetsCollectionSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterRaids({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterRaids>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterRaids.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterEquipmentSummary(
    { name, realm }: FindCharacterDto,
    cache = true,
  ): Promise<Profile.CharacterEquipmentSummary> {
    const resp = await this.rateLimiter.get<Profile.CharacterEquipmentSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterEquipmentSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );

    if (cache) {
      resp.data.equipped_items = await Promise.all(
        resp.data.equipped_items.map(async (slot) => {
          try {
            const media = await this.gameDataService.getGameItemMedia(slot.item.id);

            slot.media.assets = {
              key: media.assets[0].key,
              value: media.assets[0].value,
            };

            return slot;
          } catch (error) {
            console.log('Profile Error', error);
            return slot;
          }
        }),
      );
    }

    return resp.data;
  }

  async getCharacterHunterPetsSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterHunterPetsSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterHunterPetsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterMediaSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterMediaSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMediaSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterMythicKeystoneProfileIndex({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterMythicKeystoneProfileIndex>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMythicKeystoneProfileIndex.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name,
        ),
    );
  }

  async getCharacterMythicKeystoneSeasonDetails({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterMythicKeystoneSeasonDetails>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMythicKeystoneSeasonDetails.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterProfileSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterProfileSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterProfileSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterProfileStatus({ name, realm }: FindCharacterDto, lastModified?: string) {
    return this.rateLimiter.get<Profile.CharacterProfileStatus>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterProfileStatus.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
      lastModified,
    );
  }

  async getCharacterPvPBracketStatistics({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterPvPBracketStatistics>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterPvPBracketStatistics.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterPvPSummary({ name, realm }: FindCharacterDto, pvpBracket: number) {
    return this.rateLimiter.get<Profile.CharacterPvPSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterPvPSummary.replace('{realmSlug}', realm)
          .replace('{characterName}', name.toLowerCase())
          .replace('{pvpBracket}', pvpBracket.toString()),
    );
  }

  async getCharacterQuests({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterQuests>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterQuests.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterCompletedQuests({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterCompletedQuests>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterCompletedQuests.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterReputationsSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterReputationsSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterReputationsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterSpecializationsSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterSpecializationsSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterSpecializationsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterStatisticsSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterStatisticsSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterStatisticsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterTitlesSummary({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.CharacterTitlesSummary>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterTitlesSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuild({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.Guild>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.Guild.replace('{realmSlug}', realm).replace('{nameSlug}', name.toLowerCase()),
    );
  }

  async getGuildActivity({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.GuildActivity>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildActivity.replace('{realmSlug}', realm).replace(
          '{nameSlug}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuildAchievements({ name, realm }: FindCharacterDto) {
    return this.rateLimiter.get<Profile.GuildAchievements>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildAchievements.replace('{realmSlug}', realm).replace(
          '{nameSlug}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuildRoster({ name, realm }: FindCharacterDto, minLevel?: number) {
    const resp = await this.rateLimiter.get<Profile.GuildRoster>(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildRoster.replace('{realmSlug}', realm).replace('{nameSlug}', name.toLowerCase()),
    );

    if (minLevel) {
      resp.data.members = resp.data.members.filter((m) => m.character.level >= minLevel);
    }

    return resp;
  }
}
