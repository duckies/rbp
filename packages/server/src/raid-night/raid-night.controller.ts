import { QueryOrder } from '@mikro-orm/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateRaidNightDto } from './dto/create-raid-night.dto';
import { UpdateRaidNightDto } from './dto/update-raid-night.dto';
import { RaidNightService } from './raid-night.service';

@Controller('/raid-night')
export class RaidNightController {
  constructor(private readonly raidNightService: RaidNightService) {}

  @Post()
  @Auth('raid-night', 'create:any')
  create(@Body() createRaidNightDto: CreateRaidNightDto) {
    return this.raidNightService.create(createRaidNightDto);
  }

  @Get(':id')
  @Auth('raid-night', 'read:any')
  findOne(@Param('id') id: number) {
    return this.raidNightService.findOne(id, {
      populate: ['statuses.identity'],
    });
  }

  @Get()
  @Auth('raid-night', 'read:any')
  findAll(
    @Query() { limit, offset }: PaginationDto, // @Query('start') start?: Date, // @Query('end') end?: Date,
  ) {
    return this.raidNightService.findAll(
      {},
      { limit, offset, populate: ['statuses'] },
    );
  }

  @Patch(':id')
  @Auth('raid-night', 'update:any')
  update(
    @Param('id') id: number,
    @Body() updateRaidNightDto: UpdateRaidNightDto,
  ) {
    return this.raidNightService.update(id, updateRaidNightDto);
  }

  @Delete(':id')
  @Auth('raid-night', 'delete:any')
  delete(@Param('id') id: number) {
    return this.raidNightService.delete(id);
  }
}
