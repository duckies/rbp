import { HttpModule, Module } from '@nestjs/common';
import { RaidModule } from '../raid/raid.module';
<<<<<<< HEAD
import { RaiderIOController } from './raiderIO.controller';
import { RaiderIOScheduler } from './raiderIO.scheduler';
=======
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { RaiderIOService } from './raiderIO.service';

@Module({
  imports: [HttpModule, RaidModule],
<<<<<<< HEAD
  providers: [RaiderIOService, RaiderIOScheduler],
  controllers: [RaiderIOController],
=======
  providers: [RaiderIOService],
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  exports: [RaiderIOService],
})
export class RaiderIOModule {}
