import { CacheModule, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [PostController],
  providers: [PostService],
  exports: [],
})
export class PostModule {}
