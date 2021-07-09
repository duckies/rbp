import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { RaiderIOModule } from '../raiderIO/raiderIO.module';
import { WarcraftLogsModule } from '../warcraftlogs/warcraftlogs.module';
import { FormCharacterController } from './form-character.controller';
import { FormCharacter } from './form-character.entity';
import { FormCharacterQueue } from './form-character.queue';
import { FormCharacterScheduler } from './form-character.scheduler';
import { FormCharacterService } from './form-character.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [FormCharacter] }),
    BullModule.registerQueue({ name: 'form-character' }),
    BlizzardModule,
    RaiderIOModule,
    WarcraftLogsModule,
  ],
  providers: [FormCharacterService, FormCharacterQueue, FormCharacterScheduler],
  controllers: [FormCharacterController],
  exports: [FormCharacterService],
})
export class FormCharacterModule {}
