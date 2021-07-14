import { Module } from '@nestjs/common';
import { RaidNightController } from './raid-night.controller';
import { RaidNightService } from './raid-night.service';

@Module({
  imports: [],
  controllers: [RaidNightController],
  providers: [RaidNightService],
  exports: [],
})
export class RaidNightModule {}
