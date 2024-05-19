import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
  DatabaseModule,
  HealthModule,
  LoggerModule,
  NOTIFICATIONS_SERVICE,
  Users,
} from '@app/common';
import * as Joi from 'joi';
import { Reservations } from './models/reservations.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/const/services';
import { ThemesModule } from './themes/themes.module';
import { SlotsModule } from './slots/slots.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Themes } from './themes/models/themes.entity';
import { Slots } from './slots/models/slots.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Reservations, Slots, Themes, Users]),
    HealthModule,
    DatabaseModule,
    DatabaseModule.forFeature([Reservations]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'auth',
          },
        }),
        inject: [ConfigService],
      },
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'notifications',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ThemesModule,
    SlotsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
