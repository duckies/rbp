import { CacheModule, Module } from '@nestjs/common';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import { ArticleController } from './article.controller';
import { Article } from './article.entity';
import { ArticleService } from './article.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Article] }), CacheModule.register()],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
