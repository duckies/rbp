import { Module } from "@nestjs/common";
import { SlideService } from "./slide.service";
import { SlideController } from "./slide.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Slide } from "./slide.entity";
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Slide]), AuthModule],
  providers: [SlideService],
  controllers: [SlideController]
})
export class SlideModule {}