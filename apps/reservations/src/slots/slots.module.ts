import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Slots } from './models/slots.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Themes } from '../themes/models/themes.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Slots, Themes]),
    LoggerModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
