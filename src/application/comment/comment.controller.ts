import { Controller, Post, Body, UseGuards, Get, Param, Put } from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { CommentService } from './comment.service';
import { Usr } from '../../user/user.decorator';
import { User } from '../../user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { ComposeGuard } from '../../auth/guards/compose.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(ComposeGuard)
  create(@Usr() user: User, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(user, createCommentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'comment', action: 'update', possession: 'any' })
  update(@Param('id') id: number, @Usr() user: User, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.update(id, user, updateCommentDto);
  }
}
