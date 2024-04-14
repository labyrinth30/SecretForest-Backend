import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: UserDocument, response: Response) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    return response.json({
      id: user._id,
      email: user.email,
      accessToken,
    });
  }
  signToken(user: Pick<UserDocument, '_id'>, isRefreshToken: boolean) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
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

  async logout(response: Response) {
    response.clearCookie('refreshToken');
    return response.json({ message: '로그아웃 되었습니다.' });
  }
}
