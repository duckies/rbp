import {
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
@UseInterceptors(CacheInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth('post', 'create:any')
  @Post()
  create(@Usr() user: User, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(user, createPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Get()
  @CacheTTL(60)
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.postService.findAll({}, { limit, offset });
  }

  @Auth('post', 'update:any')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Auth('post', 'delete:any')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.postService.delete(id);
  }
}
