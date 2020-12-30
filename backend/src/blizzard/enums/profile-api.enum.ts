import { FindCharacterDto } from '../dto/find-character.dto';

export interface ProfileEndpointParams {
  [ProfileEndpoint.AccountProfileSummary]: undefined;
  [ProfileEndpoint.ProtectedAccountProfileSummary]: {
    realmId: string | number;
    characterId: string | number;
  };
  [ProfileEndpoint.AccountCollectionsIndex]: undefined;
  [ProfileEndpoint.AccountCollectionsIndex]: undefined;
  [ProfileEndpoint.AccountMountsCollectionSummary]: undefined;
  [ProfileEndpoint.AccountPetsCollectionSummary]: undefined;
  [ProfileEndpoint.CharacterAchievementsSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterAchievementStatistics]: FindCharacterDto;
  [ProfileEndpoint.CharacterAppearanceSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterCollectionsIndex]: FindCharacterDto;
  [ProfileEndpoint.CharacterMountsCollectionSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterPetsCollectionSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterEncountersSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterDungeons]: FindCharacterDto;
  [ProfileEndpoint.CharacterRaids]: FindCharacterDto;
  [ProfileEndpoint.CharacterEquipmentSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterHunterPetsSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterMediaSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterMythicKeystoneProfileIndex]: FindCharacterDto;
  [ProfileEndpoint.CharacterMythicKeystoneSeasonDetails]: FindCharacterDto & {
    seasonId: string | number;
  };
  [ProfileEndpoint.CharacterProfileSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterProfileStatus]: FindCharacterDto;
  [ProfileEndpoint.CharacterPvPBracketStatistics]: FindCharacterDto & {
    pvpBracket: string | number;
  };
  [ProfileEndpoint.CharacterPvPSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterQuests]: FindCharacterDto;
  [ProfileEndpoint.CharacterCompletedQuests]: FindCharacterDto;
  [ProfileEndpoint.CharacterReputationsSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterSpecializationsSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterStatisticsSummary]: FindCharacterDto;
  [ProfileEndpoint.CharacterTitlesSummary]: FindCharacterDto;
  [ProfileEndpoint.Guild]: { realmSlug: string; nameSlug: string };
  [ProfileEndpoint.GuildActivity]: { realmSlug: string; nameSlug: string };
  [ProfileEndpoint.GuildAchievements]: { realmSlug: string; nameSlug: string };
  [ProfileEndpoint.GuildRoster]: { realmSlug: string; nameSlug: string };
}

export enum ProfileEndpoint {
  // Account Profile API
  AccountProfileSummary = '/profile/user/wow',
  ProtectedAccountProfileSummary = '/profile/user/wow/protected-character/{realmId}-{characterId}',
  AccountCollectionsIndex = '/profile/user/wow/collections',
  AccountMountsCollectionSummary = '/profile/user/wow/collections/mounts',
  AccountPetsCollectionSummary = '/profile/user/wow/collections/pets',
  // Character Achievements API
  CharacterAchievementsSummary = '/profile/wow/character/{realm}/{name}/achievements',
  CharacterAchievementStatistics = '/profile/wow/character/{realm}/{name}/achievements/statistics',
  // Character Appearance API
  CharacterAppearanceSummary = '/profile/wow/character/{realm}/{name}/appearance',
  // Character Collections API
  CharacterCollectionsIndex = '/profile/wow/character/{realm}/{name}/collections',
  CharacterMountsCollectionSummary = '/profile/wow/character/{realm}/{name}/collections/mounts',
  CharacterPetsCollectionSummary = '/profile/wow/character/{realm}/{name}/collections/pets',
  // Character Encounters API
  CharacterEncountersSummary = '/profile/wow/character/{realm}/{name}/encounters',
  CharacterDungeons = '/profile/wow/character/{realm}/{name}/encounters/dungeons',
  CharacterRaids = '/profile/wow/character/{realm}/{name}/encounters/raids',
  // Character Equipment API
  CharacterEquipmentSummary = '/profile/wow/character/{realm}/{name}/equipment',
  // Character Hunter Pets API
  CharacterHunterPetsSummary = '/profile/wow/character/{realm}/{name}/hunter-pets',
  // Character Media API
  CharacterMediaSummary = '/profile/wow/character/{realm}/{name}/character-media',
  // Character Mythic Keystone Profile API
  CharacterMythicKeystoneProfileIndex = '/profile/wow/character/{realm}/{name}/mythic-keystone-profile',
  CharacterMythicKeystoneSeasonDetails = '/profile/wow/character/{realm}/{name}/mythic-keystone-profile/season/{seasonId}',
  // Character Profile API
  CharacterProfileSummary = '/profile/wow/character/{realm}/{name}',
  CharacterProfileStatus = '/profile/wow/character/{realm}/{name}/status',
  // Character PvP API
  CharacterPvPBracketStatistics = '/profile/wow/character/{realm}/{name}/pvp-bracket/{pvpBracket}',
  CharacterPvPSummary = '/profile/wow/character/{realm}/{name}/pvp-summary',
  // Character Quests API
  CharacterQuests = '/profile/wow/character/{realm}/{name}/quests',
  CharacterCompletedQuests = '/profile/wow/character/{realm}/{name}/quests/completed',
  // Character Reputations API
  CharacterReputationsSummary = '/profile/wow/character/{realm}/{name}/reputations',
  // Character Specializations API
  CharacterSpecializationsSummary = '/profile/wow/character/{realm}/{name}/specializations',
  // Character Statistics API
  CharacterStatisticsSummary = '/profile/wow/character/{realm}/{name}/statistics',
  // Character Titles API
  CharacterTitlesSummary = '/profile/wow/character/{realm}/{name}/titles',
  // Guild API
  Guild = '/data/wow/guild/{realm}/{nameSlug}',
  GuildActivity = '/data/wow/guild/{realm}/{nameSlug}/activity',
  GuildAchievements = '/data/wow/guild/{realm}/{nameSlug}/achievements',
  GuildRoster = '/data/wow/guild/{realm}/{nameSlug}/roster',
}
