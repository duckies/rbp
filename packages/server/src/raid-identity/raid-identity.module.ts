import { Module } from '@nestjs/common';
import { RaidIdentityController } from './raid-identity.controller';
import { RaidIdentityService } from './raid-identity.service';

@Module({
  imports: [],
  controllers: [RaidIdentityController],
  providers: [RaidIdentityService],
  exports: [],
})
export class RaidIdentityModule {}
