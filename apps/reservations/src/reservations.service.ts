import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { NOTIFICATIONS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: UserDto,
  ) {
    const newReservation = this.reservationsRepository.create({
      ...createReservationDto,
      userId,
    });
    this.notificationService.emit('notify_email', {
      email,
      text: 'Reservation created',
    });
    return newReservation;
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationsRepository.findOne({
      _id,
    });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
