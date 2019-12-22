import { HttpModule, Module } from '@nestjs/common';
import { RaidModule } from '../raid/raid.module';
import { RaiderIOController } from './raiderIO.controller';
import { RaiderIOScheduler } from './raiderIO.scheduler';
import { RaiderIOService } from './raiderIO.service';

@Module({
  imports: [HttpModule, RaidModule],
  providers: [RaiderIOService, RaiderIOScheduler],
  controllers: [RaiderIOController],
  exports: [RaiderIOService],
})
export class RaiderIOModule {}
