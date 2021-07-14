import { CacheModule, Module } from '@nestjs/common';
import { SlideController } from './slide.controller';
import { SlideService } from './slide.service';

@Module({
  imports: [CacheModule.register()],
  providers: [SlideService],
  controllers: [SlideController],
})
export class SlideModule {}
