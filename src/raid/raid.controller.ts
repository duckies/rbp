import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { CreateRaidDto } from './dto/create-raid.dto';
import { UpdateRaidDto } from './dto/update-raid.dto';
import { RaidService } from './raid.service';

@Controller('raids')
@UseInterceptors(CacheInterceptor)
export class RaidController {
  constructor(
    private readonly raidService: RaidService,
    private readonly raiderIOService: RaiderIOService,
  ) {}

  @Auth('raid', 'create:any')
  @Post()
  create(@Body() createRaidDto: CreateRaidDto) {
    return this.raidService.create(createRaidDto);
  }

  @Get('guild')
  getGuildRaiderIO() {
    return this.raiderIOService.getGuildRaiderIO();
  }

  @Get('featured')
  findAllFeatured(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.raidService.findAllFeatured(take, skip);
  }

  @Get()
  findAll(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.raidService.findAll(take, skip);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.raidService.findOne(id);
  }

  @Auth('raid', 'delete:any')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateRaidDto: UpdateRaidDto) {
    return this.raidService.update(id, updateRaidDto);
  }
}
