import { ProfileEndpoint } from '../../enums/profile-api.enum';
import {
  AccountCollectionsIndex,
  AccountMountsCollectionSummary,
  AccountPetsCollectionSummary,
  AccountProfileSummary,
  CharacterAchievementsSummary,
  CharacterAchievementStatistics,
  CharacterAppearanceSummary,
  CharacterCollectionsIndex,
  CharacterCompletedQuests,
  CharacterEquipmentSummary,
  CharacterHunterPetsSummary,
  CharacterMediaSummary,
  CharacterMountsCollectionSummary,
  CharacterMythicKeystoneProfileIndex,
  CharacterMythicKeystoneSeasonDetails,
  CharacterPetsCollectionSummary,
  CharacterProfileStatus,
  CharacterProfileSummary,
  CharacterPvPBracketStatistics,
  CharacterPvPSummary,
  CharacterQuests,
  CharacterReputationsSummary,
  CharacterSpecializationsSummary,
  CharacterStatisticsSummary,
  CharacterTitlesSummary,
  Guild,
  GuildAchievements,
  GuildActivity,
  GuildRoster,
  ProtectedCharacterProfileSummary,
} from './index';

export type ProfileEndpointReturnType = {
  // Account Profile API
  [ProfileEndpoint.AccountProfileSummary]: AccountProfileSummary;
  [ProfileEndpoint.ProtectedAccountProfileSummary]: ProtectedCharacterProfileSummary;
  [ProfileEndpoint.AccountCollectionsIndex]: AccountCollectionsIndex;
  [ProfileEndpoint.AccountMountsCollectionSummary]: AccountMountsCollectionSummary;
  [ProfileEndpoint.AccountPetsCollectionSummary]: AccountPetsCollectionSummary;
  // Character Achievements API
  [ProfileEndpoint.CharacterAchievementsSummary]: CharacterAchievementsSummary;
  [ProfileEndpoint.CharacterAchievementStatistics]: CharacterAchievementStatistics;
  // Character Appearance API
  [ProfileEndpoint.CharacterAppearanceSummary]: CharacterAppearanceSummary;
  // Character Collections API
  [ProfileEndpoint.CharacterCollectionsIndex]: CharacterCollectionsIndex;
  [ProfileEndpoint.CharacterMountsCollectionSummary]: CharacterMountsCollectionSummary;
  [ProfileEndpoint.CharacterPetsCollectionSummary]: CharacterPetsCollectionSummary;
  // Character Equipment API
  [ProfileEndpoint.CharacterEquipmentSummary]: CharacterEquipmentSummary;
  // Character Hunter Pets APi
  [ProfileEndpoint.CharacterHunterPetsSummary]: CharacterHunterPetsSummary;
  // Character Media Summary
  [ProfileEndpoint.CharacterMediaSummary]: CharacterMediaSummary;
  // Character Mythic Keystone Profile API
  [ProfileEndpoint.CharacterMythicKeystoneProfileIndex]: CharacterMythicKeystoneProfileIndex;
  [ProfileEndpoint.CharacterMythicKeystoneSeasonDetails]: CharacterMythicKeystoneSeasonDetails;
  // Character Profile Summary
  [ProfileEndpoint.CharacterProfileSummary]: CharacterProfileSummary;
  [ProfileEndpoint.CharacterProfileStatus]: CharacterProfileStatus;
  // Character PvP API
  [ProfileEndpoint.CharacterPvPBracketStatistics]: CharacterPvPBracketStatistics;
  [ProfileEndpoint.CharacterPvPSummary]: CharacterPvPSummary;
  // Character Quests API
  [ProfileEndpoint.CharacterQuests]: CharacterQuests;
  [ProfileEndpoint.CharacterCompletedQuests]: CharacterCompletedQuests;
  // Character Reputations API
  [ProfileEndpoint.CharacterReputationsSummary]: CharacterReputationsSummary;
  // Character Specializations API
  [ProfileEndpoint.CharacterSpecializationsSummary]: CharacterSpecializationsSummary;
  // Character Statistics API
  [ProfileEndpoint.CharacterStatisticsSummary]: CharacterStatisticsSummary;
  // Character Titles API
  [ProfileEndpoint.CharacterTitlesSummary]: CharacterTitlesSummary;
  // Guild API
  [ProfileEndpoint.Guild]: Guild;
  [ProfileEndpoint.GuildActivity]: GuildActivity;
  [ProfileEndpoint.GuildAchievements]: GuildAchievements;
  [ProfileEndpoint.GuildRoster]: GuildRoster;
};
