import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { Slots } from './models/slots.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
