import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlizzardAsset } from '../blizzard-asset/blizzard-asset.entity';
import { HttpModule } from '../http/http.module';
import { BlizzardService } from './blizzard.service';
import { PlayableClassMedia } from './entities/playable-class-media.entity';
import { PlayableClass } from './entities/playable-class.entity';
import { PlayableSpecializationMedia } from './entities/playable-specialization-media.entity';
import { PlayableSpecialization } from './entities/playable-specialization.entity';
import { BattleNetService } from './services/battle-net/battle-net.service';
import { GameDataController } from './services/game-data/game-data.controller';
import { GameDataService } from './services/game-data/game-data.service';
import { ProfileController } from './services/profile/profile.controller';
import { ProfileService } from './services/profile/profile.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      BlizzardAsset,
      PlayableClass,
      PlayableClassMedia,
      PlayableSpecialization,
      PlayableSpecializationMedia,
    ]),
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        axios: { baseURL: 'https://us.api.blizzard.com' },
        oauth: {
          name: 'Battle.net',
          clientId: config.get('BLIZZARD_CLIENTID'),
          clientSecret: config.get('BLIZZARD_SECRET'),
          tokenUrl: 'https://us.battle.net/oauth/token',
        },
      }),
    }),
  ],
  providers: [
    ProfileService,
    GameDataService,
    BattleNetService,
    BlizzardService,
  ],
  controllers: [ProfileController, GameDataController],
  exports: [ProfileService, BattleNetService, GameDataService],
})
export class BlizzardModule {}
