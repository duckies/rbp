import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../../user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  async create(user: User, createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.repository.create(createCommentDto);

    comment.author = user;

    return this.repository.save(comment);
  }

  findOne(id: number): Promise<Comment> {
    return this.repository.findOneOrFail(id);
  }

  async update(id: number, user: User, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.repository.findOneOrFail(id);

    if (comment.author.id != user.id) {
      throw new UnauthorizedException();
    }

    const result = this.repository.merge(comment, updateCommentDto);

    return await this.repository.save(result);
  }
}
