import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CharacterHistory } from './character-history.entity';
import { CharacterHistoryScheduler } from './character-history.scheduler';
import { CharacterHistoryService } from './character-history.service';

@Module({
  imports: [MikroOrmModule.forFeature([CharacterHistory])],
  providers: [CharacterHistoryService, CharacterHistoryScheduler],
  controllers: [],
  exports: [CharacterHistoryService],
})
export class CharacterHistoryModule {}
