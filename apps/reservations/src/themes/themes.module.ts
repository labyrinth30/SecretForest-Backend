import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservations } from '../models/reservations.entity';
import { Slot } from '../slots/models/slot.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Reservations, Slot]),
    LoggerModule,
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
