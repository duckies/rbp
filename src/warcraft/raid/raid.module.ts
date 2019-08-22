import { Raid } from './raid.entity';
import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidService } from './raid.service';
import { RaidController } from './raid.controller';
import { AuthModule } from '../../auth/auth.module';
import { RaiderIOService } from '../raiderIO/raiderIO.service';

@Module({
  imports: [TypeOrmModule.forFeature([Raid]), AuthModule, HttpModule],
  controllers: [RaidController],
  providers: [RaidService, RaiderIOService],
  exports: [RaidService, RaiderIOService]
})
export class RaidModule {}