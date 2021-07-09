import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { FindCharacterDto } from '../blizzard/dto/find-character.dto';
import { FormCharacterService } from './form-character.service';

@Controller('form-character')
export class FormCharacterController {
  constructor(private readonly formCharacterService: FormCharacterService) {}

  @Auth()
  @Get('/:region/:realm/:name')
  formCharacterData(@Param() findCharacterDto: FindCharacterDto) {
    return this.formCharacterService.create(findCharacterDto, true);
  }
}
