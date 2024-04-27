import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Slot } from './models/slot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemesModule } from '../themes/themes.module';
import { Theme } from '../themes/models/theme.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Slot, Theme]),
    LoggerModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
