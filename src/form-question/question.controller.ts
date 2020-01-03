import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { AccessControlGuard } from '../auth/guards/compose.guard';
import { FindFormDto } from '../form/dto';
import { CreateQuestionDto, FindQuestionDto, UpdateQuestionDto } from './dto';
import { FormQuestion } from './question.entity';
import { FormQuestionService } from './question.service';

@Controller('question')
export class FormQuestionController {
  constructor(private readonly formQuestionService: FormQuestionService) {}

  @Post()
  // @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'question', action: 'create', possession: 'any' })
  create(@Body() createQuestionDto: CreateQuestionDto): Promise<FormQuestion> {
    return this.formQuestionService.create(createQuestionDto);
  }

  @Get()
  findByForm(@Param() { id }: FindFormDto): Promise<FormQuestion[]> {
    return this.formQuestionService.findByForm(id);
  }

  @Get(':id')
  findOne(@Param() { id }: FindQuestionDto): Promise<FormQuestion> {
    return this.formQuestionService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AccessControlGuard)
  @UseRoles({ resource: 'question', action: 'update', possession: 'any' })
  update(@Body() updateQuestionDto: UpdateQuestionDto): Promise<FormQuestion> {
    return this.formQuestionService.update(updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(AccessControlGuard)
  @UseRoles({ resource: 'question', action: 'delete', possession: 'any' })
  delete(@Param() { id }: FindQuestionDto): Promise<FormQuestion> {
    return this.formQuestionService.delete(id);
  }
}
