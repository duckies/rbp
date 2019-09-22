import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterService } from './character.service';
import { CharacterScheduler } from './character.scheduler';
import { CharacterQueue } from './character.queue';
import { Character } from './character.entity';
import { AuthModule } from '../../auth/auth.module';
import { CharacterController } from './character.controller';
import { TokenService } from '../blizzard/token.service';
import { BlizzardModule } from '../blizzard/blizzard.module';

@Module({
  imports: [TypeOrmModule.forFeature([Character]), AuthModule, HttpModule, BlizzardModule],
  providers: [CharacterService, CharacterQueue, CharacterScheduler, TokenService],
  exports: [CharacterService, CharacterQueue],
  controllers: [CharacterController],
})
export class CharacterModule {}
