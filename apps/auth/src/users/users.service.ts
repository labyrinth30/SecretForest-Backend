import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Users } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    return this.usersRepository.save(user);
  }
  async validateCreateUserDto(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new UnprocessableEntityException('이미 사용 중인 이메일입니다.');
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
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
    return this.usersRepository.findOne({
      where: {
        id: getUserDto.id,
      },
    });
  }
  async findByEmailOrSave(
    email: string,
    name: string,
    providerId: string,
  ): Promise<Users> {
    const foundUser = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (foundUser) {
      return foundUser;
    }
    const newUser = this.usersRepository.create({
      password: '',
      email,
      name,
      providerId,
    });
    return newUser;
  }
  async findAll() {
    return this.usersRepository.find();
  }
  async deleteByUserId(userId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new UnprocessableEntityException('사용자를 찾을 수 없습니다.');
    }
    await this.usersRepository.delete(userId);
    return userId;
  }
}
