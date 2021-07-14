import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRaidIdentityStatusDto } from './dto/create-raid-identity-status.dto';
import { UpdateRaidIdentityStatusDto } from './dto/update-raid-identity-status.dto';
import { RaidIdentityStatusService } from './raid-identity-status.service';

@Controller('/raid-identity-status')
export class RaidIdentityStatusController {
  constructor(
    private readonly raidIdentityStatusService: RaidIdentityStatusService,
  ) {}

  @Post(':nightId')
  create(
    @Param('nightId') nightId: number,
    @Body() createRaidIdentityStatusDto: CreateRaidIdentityStatusDto,
  ) {
    return this.raidIdentityStatusService.create(
      nightId,
      createRaidIdentityStatusDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.raidIdentityStatusService.findOne(id);
  }

  @Get()
  findAll(@Query('nightId') nightId?: number) {
    return this.raidIdentityStatusService.findAll({ raidNight: nightId });
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRaidIdentityStatusDto: UpdateRaidIdentityStatusDto,
  ) {
    return this.raidIdentityStatusService.update(
      id,
      updateRaidIdentityStatusDto,
    );
  }
}
