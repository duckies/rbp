import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AccessControlGuard } from './../auth/guards/compose.guard';
import { FindCharacterDto } from './../blizzard/dto/find-character.dto';
import { FormCharacterService } from './form-character.service';

@Controller('form-character')
export class FormCharacterController {
  constructor(private readonly formCharacterService: FormCharacterService) {}

  @UseGuards(AccessControlGuard)
  @Get('/:region/:realm/:name')
  formCharacterData(@Param() findCharacterDto: FindCharacterDto) {
    return this.formCharacterService.create(findCharacterDto, true);
  }
}
