import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModel } from './entity/users.entity';
import { CreateUserDto } from './dto/create.user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}
  async getAllUsers() {
    return this.usersRepository.find();
  }
  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
  async createUser(dto: CreateUserDto) {
    // 1) 이메일 중복이 없는지 확인
    const emailExist = await this.usersRepository.exists({
      where: {
        email: dto.email,
      },
    });
    if (emailExist) {
      throw new BadRequestException('이미 가입한 이메일입니다.');
    }

    const userObject = this.usersRepository.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }
  async deleteAllUsers() {
    return this.usersRepository.delete({});
  }
}
