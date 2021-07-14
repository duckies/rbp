import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { RaiderIOService } from '../raider.io/raiderIO.service';
import { RaidController } from './raid.controller';
import { RaidService } from './raid.service';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [RaidController],
  providers: [RaidService, RaiderIOService],
  exports: [RaidService],
})
export class RaidModule {}
