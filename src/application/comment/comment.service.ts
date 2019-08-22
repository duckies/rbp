import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(user: User, createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = new Comment()
    comment.author = user;
    
    const result = this.commentRepository.merge(comment, createCommentDto);
    return this.commentRepository.save(result);
  }

  findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    user: User,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOneOrFail(id);

    if (comment.author.id != user.id) {
      throw new UnauthorizedException()
    }

    const result = this.commentRepository.merge(comment, updateCommentDto);

    return await this.commentRepository.save(result);
  }
}
