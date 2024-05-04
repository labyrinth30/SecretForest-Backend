import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser, Users } from '@app/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './users/dto/create-user.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
  @UseGuards(LocalAuthGuard)
  @Post('login/email')
  async login(
    @CurrentUser() user: Users,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout(response);
  }
  @Post('token/access')
  @UseGuards(JwtAuthGuard)
  tokenAccess(@CurrentUser() user: Users) {
    const newToken = this.authService.rotateToken(user, false);
    return { accessToken: newToken };
  }
  @Post('token/refresh')
  @UseGuards(JwtAuthGuard)
  tokenRefresh(@CurrentUser() user: Users, @Res() res: Response) {
    const newToken = this.authService.rotateToken(user, true);
    res.cookie('refreshToken', newToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    return res.send(true);
  }
  @Post('register/email')
  async registerEmail(@Body() body: CreateUserDto, @Res() res: Response) {
    await this.authService.registerWithEmail(body, res);
  }
  @Get('to-google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req as unknown as Users;
    return this.authService.googleLogin(user, res);
  }
}
