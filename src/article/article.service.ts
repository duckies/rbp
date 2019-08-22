import { Injectable } from '@nestjs/common';
import { Article } from './article.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import slugify from 'slugify';
import { User } from '../user/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(
    user: User,
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    const article = await this.articleRepository.create(createArticleDto);

    article.slug = slugify(createArticleDto.title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });
    article.author = user;

    return article.save();
  }

  async findAll(
    take: number = 8,
    skip: number = 0,
  ): Promise<{ result: Article[]; total: number }> {
    const [result, total] = await this.articleRepository.findAndCount({
      order: { id: 'DESC' },
      take,
      skip,
    });

    return { result, total };
  }

  findOne(id: number): Promise<Article> {
    return this.articleRepository.findOneOrFail(id);
  }

  findBySlug(slug: string): Promise<Article> {
    return this.articleRepository.findOneOrFail({ slug });
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail(id);

    const result = await this.articleRepository.merge(
      article,
      updateArticleDto,
    );

    return this.articleRepository.save(result);
  }

  async delete(id: number): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail(id);

    return this.articleRepository.remove(article);
  }
}
