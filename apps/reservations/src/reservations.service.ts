import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { Types } from 'mongoose';
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
    { email, _id: userId }: UserDto,
  ) {
    const newReservations = await this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId,
    });
    // this.notificationService.emit('notify_email', {
    //   email,
    //   text: 'Reservation created',
    // });
    return newReservations;
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(_id: string) {
    const objectId = new Types.ObjectId(_id);
    return this.reservationsRepository.findOne({
      _id: objectId,
    });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    const objectId = new Types.ObjectId(_id);
    return this.reservationsRepository.findOneAndUpdate(
      { _id: objectId },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    const objectId = new Types.ObjectId(_id);
    return this.reservationsRepository.findOneAndDelete({ _id: objectId });
  }
}
