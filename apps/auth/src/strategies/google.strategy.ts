import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;
    const providerId = id;
    const email = emails[0].value;

    const user = await this.usersService.findByEmailAndSave(
      email,
      name.familyName + name.givenName,
      providerId,
    );
    return user;
  }
}
