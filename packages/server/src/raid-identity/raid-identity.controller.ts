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
import { CreateRaidIdentityDto } from './dto/create-raid-identity.dto';
import { FindRaidIdentityDto } from './dto/find-raid-identity.dto';
import { UpdateRaidIdentityDTO } from './dto/update-raid-identity.dto';
import { RaidIdentityService } from './raid-identity.service';

@Controller('/raid-identity')
export class RaidIdentityController {
  constructor(private readonly identityService: RaidIdentityService) {}

  @Post()
  @Auth('raid-identity', 'create:any')
  create(@Body() createRaidIdentityDto: CreateRaidIdentityDto) {
    return this.identityService.create(createRaidIdentityDto);
  }

  @Get(':region/:realm/:name')
  @Auth('raid-identity', 'read:any')
  findOne(@Param() findRaidIdentityDto: FindRaidIdentityDto) {
    return this.identityService.findOne(findRaidIdentityDto);
  }

  @Get()
  @Auth('raid-identity', 'read:any')
  findAll(@Query() { limit, offset }: PaginationDto) {
    return this.identityService.findAll({}, { limit, offset });
  }

  @Patch(':region/:realm/:name')
  @Auth('raid-identity', 'update:any')
  update(
    @Param() findRaidIdentityDto: FindRaidIdentityDto,
    @Body() updateRaidIdentityDto: UpdateRaidIdentityDTO,
  ) {
    return this.identityService.update(
      findRaidIdentityDto,
      updateRaidIdentityDto,
    );
  }

  @Delete(':region/:realm/:name')
  delete(@Param() findRaidIdentityDto: FindRaidIdentityDto) {
    return this.identityService.delete(findRaidIdentityDto);
  }
}
