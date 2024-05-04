import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { NOTIFICATIONS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservations } from './models/reservations.entity';
import { Repository } from 'typeorm';
import { Slots } from './slots/models/slots.entity';
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
    @InjectRepository(Slots)
    private readonly slotsRepository: Repository<Slots>,
  ) {}
  async createReservation(
    createReservationDto: CreateReservationDto,
    { email, id }: UserDto,
  ) {
    const slot = await this.slotsRepository.findOne({
      relations: ['reservation', 'theme'],
      where: {
        id: createReservationDto.slotId,
      },
    });
    if (!slot) {
      throw new NotFoundException('잘못된 id를 입력하였습니다..');
    }
    if (slot.available === false) {
      throw new NotFoundException('예약이 마감되었습니다.');
    }
    const newReservation = this.reservationsRepository.create({
      ...createReservationDto,
      userId: id,
    });
    slot.available = false;
    await this.slotsRepository.save(slot);
    // HTML 이메일 내용 생성
    const htmlContent = `
    <h1>Reservation Created</h1>
    <p>You have successfully reserved a slot.</p>
    <p>Theme: ${slot.theme?.title}</p>
    <p>Start Time: ${slot.startTime}</p>
  `;

    // 이메일 보내기
    this.notificationService.emit('notify_email', {
      email,
      html: htmlContent,
    });
    await this.reservationsRepository.save(newReservation);
    return newReservation;
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async getReservationById(id: number) {
    const reservation = await this.reservationsRepository.findOne({
      where: {
        id,
      },
    });
    if (!reservation) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없습니다.');
    }

    for (const key in updateReservationDto) {
      if (updateReservationDto.hasOwnProperty(key)) {
        reservation[key] = updateReservationDto[key];
      }
    }

    await this.reservationsRepository.save(reservation); // 변경사항 저장
    return reservation;
  }

  async remove(id: number) {
    const reservation = await this.getReservationById(id);
    await this.reservationsRepository.remove(reservation);
    return true;
  }
}
