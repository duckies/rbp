import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule, Module } from '@nestjs/common';
import { SlideController } from './slide.controller';
import { Slide } from './slide.entity';
import { SlideService } from './slide.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Slide] }),
    CacheModule.register(),
  ],
  providers: [SlideService],
  controllers: [SlideController],
})
export class SlideModule {}
