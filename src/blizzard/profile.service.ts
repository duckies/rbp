import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { FindCharacterDto } from './dto/find-character.dto';
import { ProfileEndpoints } from './enum/profile-api.enum';
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
  constructor(private readonly rateLimiter: RateLimiter) {}

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
        ProfileEndpoints.CharacterAchievementsSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterAchievementStatistics({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterAchievementStatistics> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterAchievementStatistics.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterAppearanceSummary({ name, realm }: FindCharacterDto): Promise<Profile.CharacterAppearanceSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterAppearanceSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterCollectionsIndex({ name, realm }: FindCharacterDto): Promise<Profile.CharacterCollectionsIndex> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterCollectionsIndex.replace('{realmSlug}', realm).replace('{characterName}', name),
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
        ProfileEndpoints.CharacterPetsCollectionSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterEquipmentSummary({ name, realm }: FindCharacterDto): Promise<Profile.CharacterEquipmentSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterEquipmentSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterHunterPetsSummary({ name, realm }: FindCharacterDto): Promise<Profile.CharacterHunterPetsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterHunterPetsSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterMediaSummary({ name, realm }: FindCharacterDto): Promise<Profile.CharacterMediaSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterMediaSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
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
          name,
        ),
    );
  }

  async getCharacterProfileSummary({ name, realm }: FindCharacterDto): Promise<Profile.CharacterProfileSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterProfileSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterProfileStatus({ name, realm }: FindCharacterDto): Promise<Profile.CharacterProfileStatus> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterProfileStatus.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterPvPBracketStatistics({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterPvPBracketStatistics> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterPvPBracketStatistics.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterPvPSummary(
    { name, realm }: FindCharacterDto,
    pvpBracket: number,
  ): Promise<Profile.CharacterPvPSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterPvPSummary.replace('{realmSlug}', realm)
          .replace('{characterName}', name)
          .replace('{pvpBracket}', pvpBracket.toString()),
    );
  }

  async getCharacterQuests({ name, realm }: FindCharacterDto): Promise<Profile.CharacterQuests> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterQuests.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterCompletedQuests({ name, realm }: FindCharacterDto): Promise<Profile.CharacterCompletedQuests> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterCompletedQuests.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterReputationsSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterReputationsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterReputationsSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterSpecializationsSummary({
    name,
    realm,
  }: FindCharacterDto): Promise<Profile.CharacterSpecializationsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterSpecializationsSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterStatisticsSummary({ name, realm }: FindCharacterDto): Promise<Profile.CharacterStatisticsSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterStatisticsSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getCharacterTitlesSummary({ name, realm }: FindCharacterDto): Promise<Profile.CharacterTitlesSummary> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.CharacterTitlesSummary.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getGuild({ name, realm }: FindCharacterDto): Promise<Profile.Guild> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.Guild.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getGuildActivity({ name, realm }: FindCharacterDto): Promise<Profile.GuildActivity> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildActivity.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getGuildAchievements({ name, realm }: FindCharacterDto): Promise<Profile.GuildAchievements> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildAchievements.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }

  async getGuildRoster({ name, realm }: FindCharacterDto): Promise<Profile.GuildRoster> {
    return this.rateLimiter.getBlizzard(
      'https://us.api.blizzard.com' +
        ProfileEndpoints.GuildRoster.replace('{realmSlug}', realm).replace('{characterName}', name),
    );
  }
}
