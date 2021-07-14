import { Module } from '@nestjs/common';
import { RaidIdentityStatusController } from './raid-identity-status.controller';
import { RaidIdentityStatusService } from './raid-identity-status.service';

@Module({
  imports: [],
  controllers: [RaidIdentityStatusController],
  providers: [RaidIdentityStatusService],
  exports: [],
})
export class RaidIdentityStatusModule {}
