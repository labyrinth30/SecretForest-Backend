import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create.user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성하기', description: '유저를 생성합니다.' })
  postUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
  @Get()
  @ApiOperation({
    summary: '유저 전체 조회',
    description: '모든 유저를 조회합니다.',
  })
  getUsers() {
    return this.usersService.getAllUsers();
  }
  @Delete()
  @ApiOperation({
    summary: '유저 삭제',
    description: '모든 유저를 삭제합니다.',
  })
  deleteUser() {
    return this.usersService.deleteAllUsers();
  }
}
