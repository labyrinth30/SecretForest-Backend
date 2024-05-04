import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { Slots } from './models/slots.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Themes } from '../themes/models/themes.entity';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slots)
    private slotsRepository: Repository<Slots>,
    @InjectRepository(Themes)
    private themesRepository: Repository<Themes>,
  ) {}

  async create(createSlotDto: CreateSlotDto) {
    const theme = await this.themesRepository.findOne({
      where: {
        id: createSlotDto.themeId,
      },
    });
    if (!theme) {
      throw new NotFoundException(
        `Theme not found with id: ${createSlotDto.themeId}`,
      );
    }
    const slot = this.slotsRepository.create({
      ...createSlotDto,
      theme,
    });
    return this.slotsRepository.save(slot);
  }

  async findAll() {
    const slots = await this.slotsRepository.find({
      relations: ['theme'],
    });
    return slots;
  }

  async findSlotById(id: number): Promise<Slots> {
    const slot = await this.slotsRepository.findOne({
      relations: ['theme'],
      where: {
        id,
      },
    });
    this.notFoundExceptionIfNotExists(slot, `Slot not found with id: ${id}`);
    return slot;
  }

  async update(id: number, updateSlotDto: UpdateSlotDto) {
    const slot = await this.findSlotById(id); // 데이터 존재 확인
    const updatedSlot = await this.slotsRepository.save({
      ...slot,
      ...updateSlotDto,
    });
    return updatedSlot;
  }

  async remove(id: number) {
    const slot = await this.findSlotById(id); // 데이터 존재 확인
    await this.slotsRepository.remove(slot);
    return id;
  }

  private notFoundExceptionIfNotExists<T>(
    entity: T | null,
    errorMessage: string,
  ): void {
    if (!entity) {
      throw new NotFoundException(errorMessage);
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateWeeklySlots() {
    const themes = await this.themesRepository.find();
    for (const theme of themes) {
      const currentDate = new Date();
      const nextWeekOfToday = new Date(
        currentDate.setDate(currentDate.getDate() + 7),
      );

      for (const time of theme.timetable) {
        const [hours, minutes] = time.split(':');
        const startTime = new Date(
          nextWeekOfToday.setHours(parseInt(hours), parseInt(minutes), 0),
        );

        const newSlot = this.slotsRepository.create({
          theme: theme,
          startTime: startTime,
          available: true,
        });

        await this.slotsRepository.save(newSlot);
      }
    }
  }
}
