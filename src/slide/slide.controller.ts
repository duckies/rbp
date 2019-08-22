import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SlideService } from './slide.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { Slide } from './slide.entity';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ComposeGuard } from '../auth/guards/compose.guard';
import { UseRoles } from 'nest-access-control';

@Controller('slide')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Post()
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'slide', action: 'create', possession: 'any' })
  create(@Body() createSlideDto: CreateSlideDto): Promise<Slide> {
    return this.slideService.create(createSlideDto);
  }

  @Get()
  findAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<{ result: Slide[]; total: number }> {
    return this.slideService.findAll(take, skip);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Slide> {
    return this.slideService.findOne(id);
  }

  @Put(':id')
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'slide', action: 'update', possession: 'any' })
  update(
    @Param('id') id: number,
    @Body() updateSlideDto: UpdateSlideDto,
  ): Promise<Slide> {
    return this.slideService.update(id, updateSlideDto);
  }

  @Delete(':id')
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'slide', action: 'delete', possession: 'any' })
  delete(@Param('id') id: number): Promise<Slide> {
    return this.slideService.delete(id);
  }
}
