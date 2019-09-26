import { HttpModule, Module } from '@nestjs/common';
import { BlizzardController } from './blizzard.controller';
import { BlizzardService } from './blizzard.service';
import { TokenService } from './token.service';

@Module({
  imports: [HttpModule],
  providers: [BlizzardService, TokenService],
  exports: [BlizzardService, TokenService],
  controllers: [BlizzardController],
})
export class BlizzardModule {}
