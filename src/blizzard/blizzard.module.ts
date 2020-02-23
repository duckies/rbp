import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WoWAssets } from './assets.entity';
import { BattleNetService } from './battle.net.service';
import { BlizzardScheduler } from './blizzard.scheduler';
import { GameDataController } from './game-data.controller';
import { GameDataService } from './game-data.service';
import { BlizzardController } from './profile.controller';
import { ProfileService } from './profile.service';
import { RateLimiter } from './rate-limiter.service';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([WoWAssets]), HttpModule],
  providers: [ProfileService, GameDataService, BattleNetService, TokenService, RateLimiter, BlizzardScheduler],
  controllers: [BlizzardController, GameDataController],
  exports: [ProfileService, BattleNetService, GameDataService, TokenService, RateLimiter],
})
export class BlizzardModule {}
