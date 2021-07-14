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
import { RaiderIOService } from '../raider.io/raiderIO.service';
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

  @Get()
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.raidService.findAll({}, { limit, offset });
  }

  @Get('featured')
  findAllFeatured(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.raidService.findAll({ isFeatured: true }, { limit, offset });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.raidService.findOne(slug);
  }

  @Put(':slug')
  @Auth('raid', 'delete:any')
  update(@Param('slug') slug: string, @Body() updateRaidDto: UpdateRaidDto) {
    return this.raidService.update(slug, updateRaidDto);
  }
}
