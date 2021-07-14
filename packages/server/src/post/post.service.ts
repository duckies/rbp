import {
  EntityManager,
  FilterQuery,
  FindOneOrFailOptions,
  FindOptions,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Creates a new article.
   *
   * @param user author of the article
   * @param createArticleDto article properties
   */
  public async create(user: User, createPostDto: CreatePostDto) {
    const article = this.em.create(Post, createPostDto);

    article.slug = slugify(createPostDto.title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });
    article.author = user;

    await this.em.persist(article).flush();

    return article;
  }

  public findOne(
    where: FilterQuery<Post>,
    options?: FindOneOrFailOptions<Post>,
  ) {
    return this.em.findOneOrFail(Post, where, options);
  }

  /**
   * Retrieves all articles starting with the newest first
   * with optional pagination.
   *
   * @param limit maximum number of articles to retrieve
   * @param offset number of articles to skip
   */
  public findAll(where: FilterQuery<Post>, options?: FindOptions<Post>) {
    return this.em.findAndCount(Post, where, options);
  }

  /**
   * Updates an article with full privileges.
   *
   * @param id id of the article
   * @param updatePostDto properties to update
   */
  async update(id: number, updatePostDto: UpdatePostDto) {
    const article = await this.em.findOneOrFail(Post, id);

    this.em.assign(article, updatePostDto);

    await this.em.flush();

    return article;
  }

  /**
   * Deletes an article.
   *
   * @param id id of the article
   */
  async delete(id: number) {
    const article = await this.em.findOneOrFail(Post, id);

    await this.em.remove(article).flush();

    return article;
  }
}
