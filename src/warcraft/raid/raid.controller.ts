import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  Query,
  Put,
} from '@nestjs/common';
import { Raid } from './raid.entity';
import { RaidService } from './raid.service';
import { ComposeGuard } from '../../auth/guards/compose.guard';
import { UseRoles } from 'nest-access-control';
import { CreateRaidDto } from './dto/create-raid.dto';
import { UpdateRaidDto } from './dto/update-raid.dto';
import { RaiderIOService } from '../raiderIO/raiderIO.service';

@Controller('raid')
export class RaidController {
  constructor(
    private readonly raidService: RaidService,
    private readonly raiderIOService: RaiderIOService,
  ) {}

  @Post()
  @UseGuards(ComposeGuard)
  @UseRoles({ resource: 'raid', action: 'create', possession: 'any' })
  create(@Body() createRaidDto: CreateRaidDto): Promise<Raid> {
    return this.raidService.create(createRaidDto);
  }

  @Get('guild')
  getGuildRaiderIO() {
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
  update(
    @Param('id') id: number,
    @Body() updateRaidDto: UpdateRaidDto,
  ): Promise<Raid> {
    return this.raidService.update(id, updateRaidDto);
  }
}
