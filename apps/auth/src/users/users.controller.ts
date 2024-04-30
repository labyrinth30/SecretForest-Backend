import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser, Roles, RolesEnum, Users } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: Users) {
    return user;
  }
  @Get()
  @Roles('Admin')
  async get() {
    return this.usersService.findAll();
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteByUserId(id);
  }
}
