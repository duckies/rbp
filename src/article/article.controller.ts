import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AccessControlGuard } from '../auth/guards/compose.guard';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AccessControlGuard)
  @UseRoles({ resource: 'article', action: 'create', possession: 'any' })
  create(@Usr() user: User, @Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(user, createArticleDto);
  }

  @Get()
  findAll(@Query('take') take?: number, @Query('skip') skip?: number): Promise<{ result: Article[]; total: number }> {
    return this.articleService.findAll(take, skip);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Article> {
    return this.articleService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AccessControlGuard)
  @UseRoles({ resource: 'article', action: 'update', possession: 'any' })
  update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto): Promise<Article> {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @UseGuards(AccessControlGuard)
  @UseRoles({ resource: 'article', action: 'delete', possession: 'any' })
  delete(@Param('id') id: number): Promise<Article> {
    return this.articleService.delete(id);
  }
}
