import { Module, HttpModule } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { RaiderIOService } from './raiderIO.service';
import { RaiderIOQueue } from './raiderIO.queue';
import { RaiderIOScheduler } from './raiderIO.scheduler';
import { RaidModule } from '../raid/raid.module';
import { RaiderIOController } from './raiderIO.controller';

@Module({
  imports: [AuthModule, HttpModule, RaidModule],
  providers: [RaiderIOService, RaiderIOQueue, RaiderIOScheduler],
  exports: [RaiderIOService, RaiderIOQueue],
  controllers: [RaiderIOController],
})
export class RaiderIOModule {}
