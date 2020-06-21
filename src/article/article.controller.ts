import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
@UseInterceptors(CacheInterceptor)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Auth({ resource: 'article', action: 'create', possession: 'any' })
  @Post()
  create(@Usr() user: User, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(user, createArticleDto);
  }

  @Get()
  @CacheTTL(60)
  findAll(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.articleService.findAll(take, skip);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.articleService.findOne(id);
  }

  @Auth({ resource: 'article', action: 'update', possession: 'any' })
  @Put(':id')
  update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Auth({ resource: 'article', action: 'delete', possession: 'any' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.articleService.delete(id);
  }
}
