import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from '../common/decorator/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);
    /**
     * {accessToken: {token}}
     */
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);
    /**
     * {refreshToken: {token}}
     */
    return {
      refreshToken: newToken,
    };
  }

  // 로그인
  @Post('login/email')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    // email:password -> base64
    // fjaioejailfjkal:fnaskjfdfadfa -> email:password
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginWithEmail(credentials);
  }

  // 회원가입
  @Post('register/email')
  @IsPublic()
  postRegisterEmail(
    // 비밀번호가 8자 이하여야 할 때 유효성 검사를 하는 방법
    @Body() body: RegisterUserDto,
  ) {
    return this.authService.registerWithEmail(body);
  }
}
