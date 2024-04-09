import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import {
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from '../common/const/env-keys.const';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
    const token = splitToken[1];
    return token;
  }
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

    const split = decoded.split(':');
    if (split.length !== 2) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료되었거나 잘못된 토큰입니다.');
    }
  }
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 Refresh 토큰으로만 가능합니다.',
      );
    }
    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      expiresIn: isRefreshToken ? 3600 : 60,
    });
  }

  loginUser(
    user: Pick<UsersModel, 'email' | 'id' | 'password'>,
    response: Response,
  ) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1시간
    });
    // 사용자 정보와 accessToken 반환
    return response.json({
      id: user.id,
      email: user.email,
      accessToken,
    });
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    // 1) email이 존재하는지
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    // 2) password가 일치하는지
    /**
     * 파라미터
     *
     * 1. 입력된 비밀번호
     * 2. 기존 해시(hash) -> 사용자 정보에 저장되어있는 hash
     */
    const passOk: boolean = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    // 3) 모두 통과되면 유저 정보를 반환한다.
    return existingUser;
  }

  async loginWithEmail(
    user: Pick<UsersModel, 'email' | 'password'>,
    response: Response,
  ) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser, response);
  }

  async registerWithEmail(user: RegisterUserDto, response: Response) {
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
    );
    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser, response);
  }

  logout(response: Response) {
    response.clearCookie('refreshToken');
    return response.json({
      message: '로그아웃 되었습니다.',
    });
  }
  async googleLogin(user: UsersModel, res: Response) {
    return this.loginUser(user, res);
  }
}
