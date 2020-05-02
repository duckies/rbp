import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { MikroOrmModule } from 'nestjs-mikro-orm';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Article] })],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
