import { HttpModule, Module } from '@nestjs/common';
import { RaidModule } from '../raid/raid.module';
import { RaiderIOController } from './raiderIO.controller';
import { RaiderIOQueue } from './raiderIO.queue';
import { RaiderIOScheduler } from './raiderIO.scheduler';
import { RaiderIOService } from './raiderIO.service';

@Module({
  imports: [HttpModule, RaidModule],
  providers: [RaiderIOService, RaiderIOQueue, RaiderIOScheduler],
  controllers: [RaiderIOController],
  exports: [RaiderIOService, RaiderIOQueue],
})
export class RaiderIOModule {}
