import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WoWAssets } from './assets.entity';
<<<<<<< HEAD
import { GameDataService } from './game-data-api.service';
import { GameDataController } from './game-data.controller';
import { ProfileApiService } from './profile-api.service';
import { BlizzardController } from './profile.controller';
=======
import { BattleNetService } from './battle.net.service';
import { BlizzardScheduler } from './blizzard.scheduler';
import { GameDataController } from './game-data.controller';
import { GameDataService } from './game-data.service';
import { BlizzardController } from './profile.controller';
import { ProfileService } from './profile.service';
import { RateLimiter } from './rate-limiter.service';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([WoWAssets]), HttpModule],
<<<<<<< HEAD
  providers: [ProfileApiService, GameDataService, TokenService],
  controllers: [BlizzardController, GameDataController],
  exports: [ProfileApiService, GameDataService, TokenService],
=======
  providers: [ProfileService, GameDataService, BattleNetService, TokenService, RateLimiter, BlizzardScheduler],
  controllers: [BlizzardController, GameDataController],
  exports: [ProfileService, BattleNetService, GameDataService, TokenService, RateLimiter],
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
})
export class BlizzardModule {}
