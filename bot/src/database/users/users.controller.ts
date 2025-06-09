import { Body, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './create-users.dto';
import { UpdateUserDto } from './update-users.dto';
import { UsersService } from './users.service';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':userid')
  update(
    @Param('userid') userid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userid, updateUserDto);
  }
}
