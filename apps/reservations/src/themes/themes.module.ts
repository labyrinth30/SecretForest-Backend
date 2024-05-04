import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservations } from '../models/reservations.entity';
import { Slots } from '../slots/models/slots.entity';
import { Themes } from './models/themes.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DatabaseModule,
    TypeOrmModule.forFeature([Reservations, Slots, Themes]),
    LoggerModule,
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
