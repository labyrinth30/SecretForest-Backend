import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@app/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout(response);
  }
  @Post('token/access')
  @UseGuards(JwtAuthGuard)
  tokenAccess(@Req() req: Request) {
    const token = req.cookies['refreshToken'];
    const newToken = this.authService.rotateToken(token, false);
    return {
      accessToken: newToken,
    };
  }
  @Post('token/refresh')
  @UseGuards(JwtAuthGuard)
  tokenRefresh(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['refreshToken'];
    const newToken = this.authService.rotateToken(token, true);
    res.cookie('refreshToken', newToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
  }
}
