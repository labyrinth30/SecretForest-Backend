import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  async notifyEmail({ email, text }: NotifyEmailDto) {
    console.log(`Sending email to ${email}`);
    console.log(text);
  }
}
