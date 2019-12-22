import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { RaidController } from './raid.controller';
import { Raid } from './raid.entity';
import { RaidQueue } from './raid.queue';
import { RaidScheduler } from './raid.scheduler';
import { RaidService } from './raid.service';

@Module({
  imports: [TypeOrmModule.forFeature([Raid]), HttpModule],
  controllers: [RaidController],
  providers: [RaidService, RaiderIOService, RaidQueue, RaidScheduler],
  exports: [RaidService, RaiderIOService],
})
export class RaidModule {}
