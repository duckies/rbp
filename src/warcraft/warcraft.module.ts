import { HttpModule, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BlizzardModule } from './blizzard/blizzard.module';
import { CharacterModule } from './character/character.module';
import { RaidModule } from './raid/raid.module';
import { RaiderIOModule } from './raiderIO/raiderIO.module';

@Module({
  imports: [HttpModule, AuthModule, RaiderIOModule, RaidModule, CharacterModule, BlizzardModule],
})
export class WarcraftModule {}
