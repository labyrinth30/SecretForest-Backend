import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { Slots } from './models/slots.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slots)
    private slotsRepository: Repository<Slots>,
  ) {}

  async create(createSlotDto: CreateSlotDto) {
    const newSlot = this.slotsRepository.create(createSlotDto);
    return await this.slotsRepository.save(newSlot);
  }

  async findAll() {
    const slots = await this.slotsRepository.find();
    return slots;
  }

  async findSlotById(id: number): Promise<Slots> {
    const slot = await this.slotsRepository.findOne({ where: { id } });
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
  // TODO: 매일 자정마다 일주일 뒤의 예약 슬롯을 생성
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateWeeklySlots() {
    const dateAWeekLater = new Date();
    dateAWeekLater.setDate(dateAWeekLater.getDate() + 7);

    // 일주일 후 날짜에 대한 예약 슬롯 생성 로직
    // 예시: 매일 자정에 다음 주의 각 요일에 대한 슬롯 생성
    for (let i = 0; i < 7; i++) {
      const slotDate = new Date(dateAWeekLater);
      slotDate.setDate(dateAWeekLater.getDate() + i);
      const createSlotDto = new CreateSlotDto();
      // CreateSlotDto 구조에 맞게 날짜와 기타 정보 설정
      createSlotDto.startTime = slotDate;
      // 기타 필요한 속성 설정...

      await this.create(createSlotDto);
    }
  }
}
