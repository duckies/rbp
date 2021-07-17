import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateFormDto } from './dto/create-form.dto';
import { FindFormDto } from './dto/find-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Auth('form', 'create:any')
  @Post()
  create(@Body() createFormDto: CreateFormDto) {
    return this.formService.create(createFormDto);
  }

  @Get()
  findAll() {
    return this.formService.findAll({});
  }

  @Get(':id')
  findOneOrFail(@Param() { id }: FindFormDto) {
    return this.formService.findOneOrFail(id);
  }

  @Auth('form', 'update:any')
  @Patch(':id')
  update(@Param() { id }: FindFormDto, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.update(id, updateFormDto);
  }

  @Auth('form', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindFormDto) {
    return this.formService.delete(id);
  }
}
