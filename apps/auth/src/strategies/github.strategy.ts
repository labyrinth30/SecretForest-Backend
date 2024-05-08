import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-github';
import { UsersService } from '../users/users.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) {
    const { id, username, emails } = profile;
    const providerId = id;
    const email = emails[0].value;

    try {
      const user = await this.usersService.findByEmailOrSave(
        email,
        username,
        providerId,
      );
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
