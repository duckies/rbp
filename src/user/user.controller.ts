import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { AccessControlGuard } from '../auth/guards/compose.guard';
import { FindAllDto } from './dto/find-all.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usr } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AccessControlGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseRoles({ resource: 'user', action: 'read', possession: 'any' })
  findAll(@Query() findAllDto: FindAllDto): Promise<{ result: User[]; total: number }> {
    return this.userService.findAll(findAllDto.take, findAllDto.skip);
  }

  @Get('/me')
  findMe(@Usr() user: User): User {
    delete user.discord_access_token;
    delete user.discord_refresh_token;
    delete user.blizzard_token;

    return user;
  }

  // @Get('/known_characters')
  // findKnownCharacters(@Usr() user: User): Promise<User> {
  //   // return this.userService.findKnownCharacters(user);
  // }

  @Get(':id')
  @UseRoles({ resource: 'user', action: 'read', possession: 'any' })
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseRoles({ resource: 'user', action: 'update', possession: 'own' })
  update(@Usr() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(user.id, updateUserDto);
  }
}
