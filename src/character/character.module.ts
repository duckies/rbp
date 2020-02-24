import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { CharacterController } from './character.controller';
import { Character } from './character.entity';
import { CharacterQueue } from './character.queue';
import { CharacterScheduler } from './character.scheduler';
import { CharacterService } from './character.service';
<<<<<<< HEAD

@Module({
  imports: [TypeOrmModule.forFeature([Character]), BlizzardModule],
=======
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [TypeOrmModule.forFeature([Character]), BullModule.registerQueue({ name: 'character' }), BlizzardModule],
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  providers: [CharacterService, CharacterQueue, CharacterScheduler],
  exports: [CharacterService, CharacterQueue],
  controllers: [CharacterController],
})
export class CharacterModule {}
