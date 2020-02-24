<<<<<<< HEAD
=======
import { BullModule } from '@nestjs/bull';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { RaidController } from './raid.controller';
import { Raid } from './raid.entity';
import { RaidQueue } from './raid.queue';
import { RaidScheduler } from './raid.scheduler';
import { RaidService } from './raid.service';

@Module({
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([Raid]), HttpModule],
=======
  imports: [TypeOrmModule.forFeature([Raid]), BullModule.registerQueue({ name: 'raid' }), HttpModule],
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  controllers: [RaidController],
  providers: [RaidService, RaiderIOService, RaidQueue, RaidScheduler],
  exports: [RaidService, RaiderIOService],
})
export class RaidModule {}
