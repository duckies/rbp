import { HttpService, Injectable } from '@nestjs/common';
import { GameDataEndpoint } from './enum/game-data-api.enum';
import { TokenService } from './token.service';
import { WoWAssets, AssetType } from './assets.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as GameData from './interfaces/game-data';

export type GameDataReturnType = {
  [GameDataEndpoint.AchievementCategoriesIndex]: void;
  [GameDataEndpoint.AchievementCategory]: void;
  [GameDataEndpoint.AchievementsIndex]: void;
  [GameDataEndpoint.Achievement]: void;
  [GameDataEndpoint.AchievementMedia]: void;
  [GameDataEndpoint.AzeriteEssencesIndex]: void;
  [GameDataEndpoint.AzeriteEssence]: void;
  [GameDataEndpoint.AzeriteEssenceMedia]: void;
  [GameDataEndpoint.ConnectedRealmsIndex]: void;
  [GameDataEndpoint.ConnectedRealm]: void;
  [GameDataEndpoint.CreatureFamiliesIndex]: void;
  [GameDataEndpoint.CreatureFamily]: void;
  [GameDataEndpoint.CreatureTypesIndex]: void;
  [GameDataEndpoint.CreatureType]: void;
  [GameDataEndpoint.Creature]: void;
  [GameDataEndpoint.CreatureDisplayMedia]: void;
  [GameDataEndpoint.CreatureFamilyMedia]: void;
  [GameDataEndpoint.GuildCrestComponentsIndex]: void;
  [GameDataEndpoint.GuildCrestBorderMedia]: void;
  [GameDataEndpoint.GuildCrestEmblemMedia]: void;
  [GameDataEndpoint.ItemClassesIndex]: void;
  [GameDataEndpoint.ItemClass]: void;
  [GameDataEndpoint.ItemSubclass]: void;
  [GameDataEndpoint.Item]: void;
  [GameDataEndpoint.ItemMedia]: GameData.ItemMedia;
  [GameDataEndpoint.MythicKeystoneAffixIndex]: void;
  [GameDataEndpoint.MythicKestoneAffix]: void;
  [GameDataEndpoint.MythicRaidLeaderboard]: void;
  [GameDataEndpoint.MountsIndex]: void;
  [GameDataEndpoint.Mount]: void;
  [GameDataEndpoint.MythicKeystoneDungeonsIndex]: void;
  [GameDataEndpoint.MythicKeystoneDungeon]: void;
  [GameDataEndpoint.MythicKeystoneIndex]: void;
  [GameDataEndpoint.MythicKeystonePeriodsIndex]: void;
  [GameDataEndpoint.MythicKeystonePeriod]: void;
  [GameDataEndpoint.MythicKeystoneSeasonsIndex]: void;
  [GameDataEndpoint.MythicKeystoneSeason]: void;
  [GameDataEndpoint.MythicKeystoneLeaderboardsIndex]: void;
  [GameDataEndpoint.MythicKeystoneLeaderboard]: void;
  [GameDataEndpoint.PetsIndex]: void;
  [GameDataEndpoint.Pet]: void;
  [GameDataEndpoint.PlayableClassesIndex]: void;
  [GameDataEndpoint.PlayableClass]: void;
  [GameDataEndpoint.PlayableClassMedia]: void;
  [GameDataEndpoint.PvPTalentSlots]: void;
  [GameDataEndpoint.PlayableRacesIndex]: void;
  [GameDataEndpoint.PlayableRace]: void;
  [GameDataEndpoint.PlayableSpecializationsIndex]: void;
  [GameDataEndpoint.PlayableSpecialization]: void;
  [GameDataEndpoint.PowerTypesIndex]: void;
  [GameDataEndpoint.PowerType]: void;
  [GameDataEndpoint.PvPSeasonsIndex]: void;
  [GameDataEndpoint.PvPSeason]: void;
  [GameDataEndpoint.PvPLeaderboardsIndex]: void;
  [GameDataEndpoint.PvPLeaderboard]: void;
  [GameDataEndpoint.PvPRewardsIndex]: void;
  [GameDataEndpoint.PvPTierMedia]: void;
  [GameDataEndpoint.PvPTiersIndex]: void;
  [GameDataEndpoint.PvPTier]: void;
  [GameDataEndpoint.RealmsIndex]: void;
  [GameDataEndpoint.Realm]: void;
  [GameDataEndpoint.RegionsIndex]: void;
  [GameDataEndpoint.Region]: void;
  [GameDataEndpoint.ReputationFactionsIndex]: void;
  [GameDataEndpoint.ReputationFaction]: void;
  [GameDataEndpoint.ReputationTiersIndex]: void;
  [GameDataEndpoint.ReputationTiers]: void;
  [GameDataEndpoint.TitlesIndex]: void;
  [GameDataEndpoint.Title]: void;
  [GameDataEndpoint.WoWTokenIndex]: void;
};

@Injectable()
export class GameDataService {
  constructor(
    @InjectRepository(WoWAssets)
    private readonly assetRepository: Repository<WoWAssets>,
    private readonly tokenService: TokenService,
    private readonly http: HttpService,
  ) {}

  async getGameItemMedia(id: number, download?: boolean): Promise<GameData.ItemMedia> {
    if (!download) return this.getGameData(GameDataEndpoint.ItemMedia, id);

    const asset = await this.assetRepository.findOne({ id, type: AssetType.Icon });

    if (!asset) {
      const data = await this.getGameData(GameDataEndpoint.ItemMedia, id);

      await this.assetRepository.save({ id, type: AssetType.Icon, value: data.assets[0].value });

      return data;
    }

    return {
      _links: {
        self: {
          href: `https://us.api.blizzard.com/data/wow/media/item/${id}?namespace=static-8.2.5_31884-us`,
        },
      },
      assets: [
        {
          key: 'icon',
          value: asset.value,
        },
      ],
    };
  }

  async getGameData<T extends GameDataEndpoint>(
    endpoint: T,
    param: string | number = '',
  ): Promise<GameDataReturnType[T]> {
    await this.tokenService.getToken();

    const uri = `https://us.api.blizzard.com/data/wow${endpoint}/${param}?namespace=static-us&locale=en_US`;

    // console.log(uri);

    return (await this.http.get(uri).toPromise()).data;
  }
}
