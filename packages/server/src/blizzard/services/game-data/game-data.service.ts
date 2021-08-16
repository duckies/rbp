import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { template } from '../../../app.utils';
import { HttpService } from '../../../common/http/http.service';
import { BlizzardService } from '../../blizzard.service';
import { Asset } from '../../entities/asset.entity';
import { PlayableClassMedia } from '../../entities/playable-class-media.entity';
import { PlayableClass } from '../../entities/playable-class.entity';
import { PlayableSpecializationMedia } from '../../entities/playable-specialization-media.entity';
import { PlayableSpecialization } from '../../entities/playable-specialization.entity';
import { AssetType } from '../../enums/asset-type.enum';
import { GameDataEndpoint } from '../../enums/game-data-api.enum';
import * as GameData from '../../interfaces/game-data';

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
  [GameDataEndpoint.PlayableSpecializationMedia]: void;
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
    private readonly blizzardService: BlizzardService,
    private readonly http: HttpService,
    private readonly em: EntityManager,
  ) {}

  async getGameItemMedia(id: number) {
    let asset = await this.em.findOne(Asset, {
      id,
      type: AssetType.Icon,
    });

    if (!asset) {
      const data = await this.getGameData(GameDataEndpoint.ItemMedia, id);

      await this.em
        .createQueryBuilder(Asset)
        .insert({ id, type: AssetType.Icon, value: data.assets[0].value })
        .onConflict(['id', 'type'])
        .ignore()
        .execute();

      return { id, type: AssetType.Icon, value: data.assets[0].value };
    }

    return asset;
  }

  async getPlayableClass(classId: number, cache = true) {
    let playableClass: PlayableClass = await this.em.findOne(
      PlayableClass,
      classId,
      ['media', 'specializations.media'],
    );

    if (playableClass) return playableClass;

    const endpoint = template(GameDataEndpoint.PlayableClass, { classId });
    const { data } = await this.blizzardService.getData<GameData.PlayableClass>(
      endpoint,
    );

    playableClass = new PlayableClass();
    playableClass.id = data.id;
    playableClass.name = data.name;
    playableClass.media = await this.getPlayableClassMedia(classId, cache);

    if (cache) {
      await this.em.persist(playableClass).flush();
    }

    return playableClass;
  }

  async getPlayableClassMedia(playableClassId: number, cache = true) {
    let playableClassMedia: PlayableClassMedia = await this.em.findOne(
      PlayableClassMedia,
      playableClassId,
    );

    if (playableClassMedia) return playableClassMedia;

    const endpoint = template(GameDataEndpoint.PlayableClassMedia, {
      playableClassId,
    });
    const { data } =
      await this.blizzardService.getData<GameData.PlayableClassMedia>(endpoint);

    playableClassMedia = new PlayableClassMedia();
    playableClassMedia.id = data.id;
    playableClassMedia.key = data.assets[0].key;
    playableClassMedia.value = data.assets[0].value;

    if (cache) {
      await this.em.persist(playableClassMedia).flush();
    }

    return playableClassMedia;
  }

  async getPlayableSpecialization(specId: number, cache = true) {
    let specialization = await this.em.findOne(PlayableSpecialization, specId, [
      'class',
      'media',
    ]);

    if (specialization) return specialization;

    const endpoint = template(GameDataEndpoint.PlayableSpecialization, {
      specId,
    });

    const { data } =
      await this.blizzardService.getData<GameData.PlayableSpecialization>(
        endpoint,
      );

    specialization = new PlayableSpecialization();
    specialization.id = data.id;
    specialization.name = data.name;
    specialization.class = await this.getPlayableClass(
      data.playable_class.id,
      false,
    );
    specialization.media = await this.getPlayableSpecializationMedia(
      specId,
      false,
    );

    if (cache) {
      await this.em.persist(specialization).flush();
    }

    return specialization;
  }

  async getPlayableSpecializationMedia(specId: number, cache = true) {
    let media = await this.em.findOne(PlayableSpecializationMedia, specId);

    if (media) return media;

    const endpoint = template(GameDataEndpoint.PlayableSpecializationMedia, {
      specId,
    });
    const { data } =
      await this.blizzardService.getData<GameData.PlayableSpecializationMedia>(
        endpoint,
      );

    media = new PlayableSpecializationMedia(data);

    if (cache) {
      await this.em.persist(media).flush();
    }

    return media;
  }

  getGameData<T extends GameDataEndpoint>(
    endpoint: T,
    param: string | number = '',
  ): Promise<GameDataReturnType[T]> {
    return this.http.$get(
      `/data/wow${endpoint}/${param}?namespace=static-us&locale=en_US`,
    );
  }
}
