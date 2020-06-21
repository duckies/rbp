import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { AccessControlGuard } from '../auth/guards/compose.guard';
import { RaiderIOGuild } from '../raiderIO/raiderIO.interface';
import { RaiderIOService } from '../raiderIO/raiderIO.service';
import { CreateRaidDto } from './dto/create-raid.dto';
import { UpdateRaidDto } from './dto/update-raid.dto';
import { Raid } from './raid.entity';
import { RaidService } from './raid.service';

@Controller('raids')
@UseInterceptors(CacheInterceptor)
export class RaidController {
  constructor(private readonly raidService: RaidService, private readonly raiderIOService: RaiderIOService) {}

  @Post()
  @UseGuards(AccessControlGuard)
  @UseRoles({ resource: 'raid', action: 'create', possession: 'any' })
  create(@Body() createRaidDto: CreateRaidDto): Promise<Raid> {
    return this.raidService.create(createRaidDto);
  }

  @Get('guild')
  getGuildRaiderIO(): Promise<RaiderIOGuild> {
    return this.raiderIOService.getGuildRaiderIO();
  }

  @Get('featured')
  findAllFeatured(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<{ result: Raid[]; total: number }> {
    return this.raidService.findAllFeatured(take, skip);
  }

  @Get()
  findAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<{ result: Raid[]; total: number }> {
    return this.raidService.findAll(take, skip);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Raid> {
    return this.raidService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateRaidDto: UpdateRaidDto): Promise<Raid> {
    return this.raidService.update(id, updateRaidDto);
  }
}
