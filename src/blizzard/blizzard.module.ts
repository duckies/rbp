import { HttpModule, Module } from '@nestjs/common';
import { BlizzardController } from './blizzard.controller';
import { BlizzardService } from './blizzard.service';
import { TokenService } from './token.service';

@Module({
  imports: [HttpModule],
  providers: [BlizzardService, TokenService],
  controllers: [BlizzardController],
  exports: [BlizzardService, TokenService],
})
export class BlizzardModule {}
