<<<<<<< HEAD
export enum CharacterEndpoints {
  Index = '',
  Achievements = '/achievements',
  Appearance = '/appearance',
  CollectionsIndex = '/collections',
  MountsCollection = '/collections/mount',
  PetsCollection = '/collections/pets',
  Equipment = '/equipment',
  HunterPets = '/hunter-pets',
  Media = '/character-media',
  KeystoneProfileIndex = '/mythic-keystone-profile',
  KeystoneProfileSeason = '/mythic-keystone-profile/season/',
  Status = '/status',
  PvPBracket = '/pvp-bracket/',
  PvPSummary = '/pvp-summary',
  Reputations = '/reputations',
  Specializations = '/specializations',
  Statistics = '/statistics',
  Titles = '/titles',
}

export enum GuildEndpoints {
  Index = '',
  Achievements = '/achievements',
  Roster = '/roster',
=======
export enum ProfileEndpoints {
  // Account Profile API
  AccountProfileSummary = '/profile/user/wow',
  ProtectedAccountProfileSummary = '/profile/user/wow/protected-character/{realmId}-{characterId}',
  AccountCollectionsIndex = '/profile/user/wow/collections',
  AccountMountsCollectionSummary = '/profile/user/wow/collections/mounts',
  AccountPetsCollectionSummary = '/profile/user/wow/collections/pets',
  // Character Achievements API
  CharacterAchievementsSummary = '/profile/wow/character/{realmSlug}/{characterName}/achievements',
  CharacterAchievementStatistics = '/profile/wow/character/{realmSlug}/{characterName}/achievements/statistics',
  // Character Appearance API
  CharacterAppearanceSummary = '/profile/wow/character/{realmSlug}/{characterName}/appearance',
  // Character Collections API
  CharacterCollectionsIndex = '/profile/wow/character/{realmSlug}/{characterName}/collections',
  CharacterMountsCollectionSummary = '/profile/wow/character/{realmSlug}/{characterName}/collections/mounts',
  CharacterPetsCollectionSummary = '/profile/wow/character/{realmSlug}/{characterName}/collections/pets',
  // Character Equipment API
  CharacterEquipmentSummary = '/profile/wow/character/{realmSlug}/{characterName}/equipment',
  // Character Hunter Pets API
  CharacterHunterPetsSummary = '/profile/wow/character/{realmSlug}/{characterName}/hunter-pets',
  // Character Media API
  CharacterMediaSummary = '/profile/wow/character/{realmSlug}/{characterName}/character-media',
  // Character Mythic Keystone Profile API
  CharacterMythicKeystoneProfileIndex = '/profile/wow/character/{realmSlug}/{characterName}/mythic-keystone-profile',
  CharacterMythicKeystoneSeasonDetails = '/profile/wow/character/{realmSlug}/{characterName}/mythic-keystone-profile/season/{seasonId}',
  // Character Profile API
  CharacterProfileSummary = '/profile/wow/character/{realmSlug}/{characterName}',
  CharacterProfileStatus = '/profile/wow/character/{realmSlug}/{characterName}/status',
  // Character PvP API
  CharacterPvPBracketStatistics = '/profile/wow/character/{realmSlug}/{characterName}/pvp-bracket/{pvpBracket}',
  CharacterPvPSummary = '/profile/wow/character/{realmSlug}/{characterName}/pvp-summary',
  // Character Quests API
  CharacterQuests = '/profile/wow/character/{realmSlug}/{characterName}/quests',
  CharacterCompletedQuests = '/profile/wow/character/{realmSlug}/{characterName}/quests/completed',
  // Character Reputations API
  CharacterReputationsSummary = '/profile/wow/character/{realmSlug}/{characterName}/reputations',
  // Character Specializations API
  CharacterSpecializationsSummary = '/profile/wow/character/{realmSlug}/{characterName}/specializations',
  // Character Statistics API
  CharacterStatisticsSummary = '/profile/wow/character/{realmSlug}/{characterName}/statistics',
  // Character Titles API
  CharacterTitlesSummary = '/profile/wow/character/{realmSlug}/{characterName}/titles',
  // Guild API
  Guild = '/data/wow/guild/{realmSlug}/{nameSlug}',
  GuildActivity = '/data/wow/guild/{realmSlug}/{nameSlug}/activity',
  GuildAchievements = '/data/wow/guild/{realmSlug}/{nameSlug}/achievements',
  GuildRoster = '/data/wow/guild/{realmSlug}/{nameSlug}/roster',
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
}
