import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { FindCharacterDto } from './dto/find-character.dto';
import { ProfileEndpoints } from './enums/profile-api.enum';
import { GameDataService } from './game-data.service';
import * as Profile from './interfaces/profile';
import { RateLimiter } from './rate-limiter.service';

export interface ProfileParams {
  realmId?: number;
  characterId?: number;
  seasonId?: number;
  pvpBracket?: number;
}

@Injectable()
export class ProfileService {
  constructor(private readonly rateLimiter: RateLimiter, private readonly gameDataService: GameDataService) {}

  async getAccountProfileSummary(user: User): Promise<Profile.AccountProfileSummary> {
    return this.rateLimiter.getBlizzard('https://us.api.blizzard.com/profile/user/wow', user);
  }

  async getProtectedCharacterProfileSummary(
    realmId: number,
    characterId: number,
  ): Promise<Profile.ProtectedCharacterProfileSummary> {
    return this.rateLimiter.getBlizzard(
      `https://us.api.blizzard.com/profile/user/wow/protected-character/${realmId}-${characterId}`,
    );
  }

  async getAccountCollectionsIndex(): Promise<Profile.AccountCollectionsIndex> {
    return this.rateLimiter.getBlizzard('https://us.api.blizzard.com/profile/user/wow/collections');
  }

  async getAccountMountsCollectionSummary(): Promise<Profile.AccountMountsCollectionSummary> {
    return this.rateLimiter.getBlizzard('https://us.api.blizzard.com/profile/user/wow/collections/mounts');
  }

  async getAccountPetsCollectionSummary(): Promise<Profile.AccountPetsCollectionSummary> {
    return this.rateLimiter.getBlizzard('https://us.api.blizzard.com/profile/user/wow/collections/mounts');
  }

  async getCharacterAchievementsSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterAchievementsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterAchievementsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterAchievementStatistics({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterAchievementStatistics> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterAchievementStatistics.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterAppearanceSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterAppearanceSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterAppearanceSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterCollectionsIndex({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterCollectionsIndex> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterCollectionsIndex.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterMountsCollectionSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterMountsCollectionSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMountsCollectionSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name,
        ),
    );
  }

  async getCharacterPetsCollectionSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterPetsCollectionSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterPetsCollectionSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterRaids({ name, realm }: FindCharacterDto): Promise<Profile.CharacterRaids> {
    return this.rateLimiter.getBlizzard(
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
    const data: Profile.CharacterEquipmentSummary = await this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterEquipmentSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );

    if (cache) {
      data.equipped_items = await Promise.all(
        data.equipped_items.map(async (slot) => {
          try {
            const media = await this.gameDataService.getGameItemMedia(slot.item.id, true);

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

    return data;
  }

  async getCharacterHunterPetsSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterHunterPetsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterHunterPetsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterMediaSummary({ name, realm }: FindCharacterDto): Promise<Profile.CharacterMediaSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMediaSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterMythicKeystoneProfileIndex({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterMythicKeystoneProfileIndex> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMythicKeystoneProfileIndex.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name,
        ),
    );
  }

  async getCharacterMythicKeystoneSeasonDetails({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterMythicKeystoneSeasonDetails> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMythicKeystoneSeasonDetails.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterProfileSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterProfileSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterProfileSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterProfileStatus({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterProfileStatus> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterProfileStatus.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterPvPBracketStatistics({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterPvPBracketStatistics> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterPvPBracketStatistics.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterPvPSummary(
    { name, realm }: FindCharacterDto,
    pvpBracket: number,
  ): Promise<Profile.CharacterPvPSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterPvPSummary.replace('{realmSlug}', realm)
          .replace('{characterName}', name.toLowerCase())
          .replace('{pvpBracket}', pvpBracket.toString()),
    );
  }

  async getCharacterQuests({ name, realm }: FindCharacterDto): Promise<Profile.CharacterQuests> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterQuests.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterCompletedQuests({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterCompletedQuests> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterCompletedQuests.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterReputationsSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterReputationsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterReputationsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterSpecializationsSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterSpecializationsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterSpecializationsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterStatisticsSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterStatisticsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterStatisticsSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getCharacterTitlesSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterTitlesSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterTitlesSummary.replace('{realmSlug}', realm).replace(
          '{characterName}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuild({ name, realm }: FindCharacterDto): Promise<Profile.Guild> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.Guild.replace('{realmSlug}', realm).replace('{nameSlug}', name.toLowerCase()),
    );
  }

  async getGuildActivity({ name, realm }: FindCharacterDto): Promise<Profile.GuildActivity> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildActivity.replace('{realmSlug}', realm).replace(
          '{nameSlug}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuildAchievements({ name, realm }: FindCharacterDto): Promise<Profile.GuildAchievements> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildAchievements.replace('{realmSlug}', realm).replace(
          '{nameSlug}',
          name.toLowerCase(),
        ),
    );
  }

  async getGuildRoster({ name, realm }: FindCharacterDto, minLevel?: number): Promise<Profile.GuildRoster> {
    const data: Profile.GuildRoster = await this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildRoster.replace('{realmSlug}', realm).replace('{nameSlug}', name.toLowerCase()),
    );

    if (minLevel) {
      data.members = data.members.filter((m) => m.character.level >= minLevel);
    }

    return data;
  }
}
