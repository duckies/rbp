import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { RaidCharacterStatusService } from './raid-character-status.service';
import { RaidIdentityService } from './raid-identity.service';
import { RaidNightService } from './raid-night.service';

@Module({
  imports: [],
  controllers: [AttendanceController],
  providers: [
    RaidCharacterStatusService,
    RaidIdentityService,
    RaidNightService,
  ],
  exports: [RaidCharacterStatusService, RaidIdentityService, RaidNightService],
})
export class AttendanceModule {}
