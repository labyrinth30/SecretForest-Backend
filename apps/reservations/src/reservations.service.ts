import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { NOTIFICATIONS_SERVICE, UserDto, Users } from '@app/common';
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
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  async createReservation(
    createReservationDto: CreateReservationDto,
    { email, id }: UserDto,
  ) {
    const users: Users = await this.usersRepository.findOne({
      where: {
        id,
      }
    })
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
    // UTC 시간에서 9시간을 더하여 한국 시간으로 변환
    const koreaTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const startTime = new Date(slot.startTime); // slot.startTime이 Date 타입이라고 가정
    const koreaStartTime = new Date(startTime.getTime() + koreaTimeOffset); // 한국 시간으로 변환

    const formattedStartTime = koreaStartTime.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).replace('오전', 'am').replace('오후', 'pm'); // '2022년 November 1일 12:30 pm' 형식으로 변환


    const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h1>비밀의숲 예약 확인</h1>
    <p>${users.name}님께,</p>
    <p>${users.name}님이 예약하신 방의 이름은 <strong>${slot.theme?.title}</strong> 입니다.</p>
    <p>예약하신 날짜는 <strong>${formattedStartTime}</strong> 입니다.</p>
    <a href="http://google.com" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">비밀의숲 홈페이지</a>
    <p style="margin-top: 30px;">*예약을 취소하시고 싶으시면 하단의 <a href="YOUR_CANCELLATION_LINK" style="color: #007bff;">예약 취소하기</a>를 클릭하시면 자동으로 취소가 완료됩니다. 감사합니다.</p>
  </div>
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
