import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { Slots } from './models/slots.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Themes } from '../themes/models/themes.entity';
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
    TypeOrmModule.forFeature([Slots, Themes]),
    LoggerModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
