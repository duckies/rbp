import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), AuthModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
