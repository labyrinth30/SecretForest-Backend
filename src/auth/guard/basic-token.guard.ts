/**
 * 구현할 기능
 *
 * 1) 요청 객체(reqest)를 불러오고
 *    authorization 헤더를 통해 토큰을 가져온다.
 *
 * 2) authService.extractTokenFromHeader 메서드를 통해
 *    사용할 수 있는 형태의 토큰을 추출한다.
 *
 * 3) authService.decodeBasicToken을 실행해서
 *    eamil과 password를 추출한다.
 *
 * 4) email과 password를 가지고 authService.authenticateWithEmailAndPasswrod를 실행한다.
 *
 * 5) 찾아낸 사용자를 (1) 요청 객체에 붙여준다.
 *    req.user = user;
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1) 요청 객체(reqest)를 불러옮
    const req = context.switchToHttp().getRequest();
    // {authorization: 'Basic fjaioejailfjkal:fnaskjfdfadfa'}
    // ffjaioejailfjkal:fnaskjfdfadfa
    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다!');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const { email, password } = this.authService.decodeBasicToken(token);

    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password,
    });

    // 5) 찾아낸 사용자를 (1) 요청 객체에 붙여준다.
    req.user = user;

    return true;
  }
}
