import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from '@app/common/const';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '@app/common/dto';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      return false;
    }
    console.log(`rawToken: ${rawToken}`);
    return this.authClient
      .send<UserDto>('authenticate', {
        Authorization: rawToken,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
      );
  }
}
