import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateRaidCharacterStatusDTO } from './dto/create-raid-character-status.dto';
import { CreateRaidIdentityDTO } from './dto/create-raid-identity.dto';
import { CreateRaidNightDTO } from './dto/create-raid-night.dto';
import { RaidCharacterStatusService } from './raid-character-status.service';
import { RaidIdentityService } from './raid-identity.service';
import { RaidNightService } from './raid-night.service';

@Controller('/attendance')
export class AttendanceController {
  constructor(
    private readonly raidCharacterStatusService: RaidCharacterStatusService,
    private readonly raidIdentityService: RaidIdentityService,
    private readonly raidNightService: RaidNightService,
  ) {}

  @Post('/identity')
  private createRaidIdentity(
    @Body() createRaidIdentityDTO: CreateRaidIdentityDTO,
  ) {
    return this.raidIdentityService.create(createRaidIdentityDTO);
  }

  @Get('/identity')
  private findAllRaidIdentity(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.raidIdentityService.findAll({}, ['character'], limit, offset);
  }

  @Post('/night')
  private createRaidNight(@Body() createRaidNightDTO: CreateRaidNightDTO) {
    return this.raidNightService.create(createRaidNightDTO);
  }

  @Get('/night/:id')
  private findOneRaidNight(@Param('id') id: number) {
    return this.raidNightService.findOne(id, ['statuses.identity']);
  }

  @Post('/status')
  private createRaidCharacterStatus(
    @Body() createRaidCharacterStatusDTO: CreateRaidCharacterStatusDTO,
  ) {
    return this.raidCharacterStatusService.create(createRaidCharacterStatusDTO);
  }
}
