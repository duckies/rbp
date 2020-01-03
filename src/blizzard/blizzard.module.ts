import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WoWAssets } from './assets.entity';
import { GameDataService } from './game-data-api.service';
import { GameDataController } from './game-data.controller';
import { ProfileApiService } from './profile-api.service';
import { BlizzardController } from './profile.controller';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([WoWAssets]), HttpModule],
  providers: [ProfileApiService, GameDataService, TokenService],
  controllers: [BlizzardController, GameDataController],
  exports: [ProfileApiService, GameDataService, TokenService],
})
export class BlizzardModule {}
