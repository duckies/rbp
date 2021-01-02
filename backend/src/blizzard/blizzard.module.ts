import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule, Module } from '@nestjs/common';
import { BlizzardAsset } from '../blizzard-asset/blizzard-asset.entity';
import { RateLimiter } from './blizzard.rate-limiter';
import { BlizzardScheduler } from './blizzard.scheduler';
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
import { TokenService } from './services/token.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [
        BlizzardAsset,
        PlayableClass,
        PlayableClassMedia,
        PlayableSpecialization,
        PlayableSpecializationMedia,
      ],
    }),
    HttpModule,
  ],
  providers: [
    ProfileService,
    GameDataService,
    BattleNetService,
    TokenService,
    RateLimiter,
    BlizzardScheduler,
    BlizzardService,
  ],
  controllers: [ProfileController, GameDataController],
  exports: [
    ProfileService,
    BattleNetService,
    GameDataService,
    TokenService,
    RateLimiter,
  ],
})
export class BlizzardModule {}
