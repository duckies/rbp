import { Controller, Get, Param, UseGuards, Query, Put, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseRoles } from 'nest-access-control';
import { Usr } from './user.decorator';
import { ComposeGuard } from '../auth/guards/compose.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { KnownCharacter } from './interfaces/known-character.interface';

@Controller('user')
@UseGuards(ComposeGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseRoles({ resource: 'user', action: 'read', possession: 'any' })
  findAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<{ result: User[]; total: number }> {
    return this.userService.findAll(take, skip);
  }

  @Get('/me')
  findMe(@Usr() user: User): Promise<User> {
    return this.userService.findOne(user.id);
  }

  @Get('/known_characters')
  findKnownCharacters(@Usr() user: User): Promise<User> {
    return this.userService.findKnownCharacters(user);
  }

  @Get(':id')
  @UseRoles({ resource: 'user', action: 'read', possession: 'any' })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseRoles({ resource: 'user', action: 'update', possession: 'own' })
  update(@Usr() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }
}
