import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideController } from './slide.controller';
import { Slide } from './slide.entity';
import { SlideService } from './slide.service';

@Module({
  imports: [TypeOrmModule.forFeature([Slide])],
  providers: [SlideService],
  controllers: [SlideController],
})
export class SlideModule {}
