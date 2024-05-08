import { Injectable } from '@nestjs/common';
import { Users } from '@app/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async login(user: Users, response: Response) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    return response.json({
      id: user.id,
      email: user.email,
      accessToken,
    });
  }
  signToken(user: Users, isRefreshToken: boolean): string {
    const tokenPayload: TokenPayload = {
      userId: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }
  rotateToken(user: Users, isRefreshToken: boolean): string {
    return this.signToken(
      {
        ...user,
      },
      isRefreshToken,
    );
  }
  async registerWithEmail(user: CreateUserDto, response: Response) {
    const newUser = await this.usersService.create(user);
    return this.login(newUser, response);
  }
  async logout(response: Response) {
    response.clearCookie('refreshToken');
    return response.json({ message: '로그아웃 되었습니다.' });
  }
  socialLogin(user: Users, res: Response) {
    return this.login(user, res);
  }
}
