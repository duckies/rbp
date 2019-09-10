import { Post, Body, Controller, Get, Param } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { Usr } from '../../user/user.decorator';
import { User } from '../../user/user.entity';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}
  
  @Post()
  create(@Usr() user: User, @Body() createFormDto: CreateFormDto) {
    return this.formService.create(user, createFormDto);
  }

  @Get('/grouped/:id')
  findByGroup(@Param('id') id: number) {
    return this.formService.findByIdAndSimilarStatus(id);
  }
}