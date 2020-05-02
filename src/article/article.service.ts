import { Injectable } from '@nestjs/common';
import { EntityRepository, QueryOrder, wrap } from 'mikro-orm';
import { InjectRepository } from 'nestjs-mikro-orm';
import slugify from 'slugify';
import { User } from '../user/user.entity';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
  ) {}

  async create(user: User, createArticleDto: CreateArticleDto) {
    const article = this.articleRepository.create(createArticleDto);

    article.slug = slugify(createArticleDto.title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });
    article.author = user;

    await this.articleRepository.persistAndFlush(article);

    return article;
  }

  async findAll(take = 8, skip = 0) {
    const [result, total] = await this.articleRepository.findAndCount(
      {},
      { orderBy: { id: QueryOrder.DESC }, limit: take, offset: skip },
    );

    return { result, total };
  }

  findOne(id: number) {
    return this.articleRepository.findOneOrFail(id);
  }

  findBySlug(slug: string) {
    return this.articleRepository.findOneOrFail({ slug });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOneOrFail(id);

    wrap(article).assign(updateArticleDto);

    await this.articleRepository.flush();

    return article;
  }

  async delete(id: number) {
    const article = await this.articleRepository.findOneOrFail(id);

    await this.articleRepository.remove(article);

    return article;
  }
}
