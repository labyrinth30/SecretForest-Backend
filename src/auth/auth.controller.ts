import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from "./guard/bearer-token.guard";
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from '../common/decorator/is-public.decorator';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { UsersModel } from '../users/entity/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Req() req: Request) {
    const token = req.cookies['refreshToken'];
    const newToken = this.authService.rotateToken(token, false);
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Req() req: Request) {
    const token = req.cookies['refreshToken'];
    const newToken = this.authService.rotateToken(token, true);
    return {
      refreshToken: newToken,
    };
  }

  // 로그인
  @Post('login/email')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  postLoginEmail(
    @Headers('authorization') rawToken: string,
    @Res() res: Response,
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginWithEmail(credentials, res);
  }

  // 회원가입
  @Post('register/email')
  @IsPublic()
  postRegisterEmail(@Body() body: RegisterUserDto, @Res() response: Response) {
    return this.authService.registerWithEmail(body, response);
  }
  // 로그아웃
  @Post('logout')
  @IsPublic()
  postLogout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  // 구글 로그인
  @Get('to-google')
  @IsPublic()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google')
  @IsPublic()
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UsersModel;
    return this.authService.googleLogin(user, res);
  }
  @Get('me')
  @UseGuards(AccessTokenGuard)
  getMyInfo(
    @Headers('authorization') rawToken: string,
  )
  {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const user = this.authService.parseAccessToken(token);
    return user;
  }

}
