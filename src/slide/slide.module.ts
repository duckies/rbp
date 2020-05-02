import { Module } from '@nestjs/common';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import { SlideController } from './slide.controller';
import { Slide } from './slide.entity';
import { SlideService } from './slide.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Slide] })],
  providers: [SlideService],
  controllers: [SlideController],
})
export class SlideModule {}
