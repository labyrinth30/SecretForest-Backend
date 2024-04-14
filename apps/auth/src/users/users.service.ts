import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Types } from 'mongoose';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }
  async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({
        email: createUserDto.email,
      });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('이미 사용 중인 이메일입니다.');
  }
  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      email,
    });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    const userId = new Types.ObjectId(getUserDto._id);
    return this.usersRepository.findOne({
      _id: userId,
    });
  }
  async findByEmailOrSave(
    email: string,
    name: string,
    providerId: string,
  ): Promise<UserDocument> {
    const foundUser = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (foundUser) {
      return foundUser;
    }
    const newUser = await this.usersRepository.create({
      password: '',
      email,
      name,
      providerId,
    });
    return newUser;
  }
}
