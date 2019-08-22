import { Module, HttpModule } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RaiderIOModule } from './raiderIO/raiderIO.module';
import { RaidModule } from './raid/raid.module';
import { CharacterModule } from './character/character.module';
import { BlizzardModule } from './blizzard/blizzard.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    RaiderIOModule,
    RaidModule,
    CharacterModule,
    BlizzardModule
  ],
})
export class WarcraftModule {}
