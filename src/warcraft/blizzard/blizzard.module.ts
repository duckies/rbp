import { Module, HttpModule } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { BlizzardService } from './blizzard.service';
import { TokenService } from './token.service';
import { BlizzardController } from './blizzard.controller';

@Module({
  imports: [AuthModule, HttpModule],
  providers: [BlizzardService, TokenService],
  exports: [BlizzardService, TokenService],
  controllers: [BlizzardController]
})
export class BlizzardModule {}