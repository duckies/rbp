import {
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide } from './slide.entity';
import { SlideService } from './slide.service';

@Controller('slide')
@UseInterceptors(CacheInterceptor)
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Auth('slide', 'create:any')
  @Post()
  create(@Body() createSlideDto: CreateSlideDto) {
    return this.slideService.create(createSlideDto);
  }

  @Get()
  @CacheTTL(600)
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.slideService.findAll({}, { limit, offset });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.slideService.findOne(id);
  }

  @Auth('slide', 'update:any')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slideService.update(id, updateSlideDto);
  }

  @Auth('slide', 'delete:any')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.slideService.delete(id);
  }
}
