import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { SlotDocument, SlotEntity } from './models/slot.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: SlotDocument.name, schema: SlotEntity },
    ]),
    LoggerModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
