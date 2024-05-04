import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservations } from '../models/reservations.entity';
import { Slots } from '../slots/models/slots.entity';
import { Themes } from './models/themes.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Reservations, Slots, Themes]),
    LoggerModule,
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
