import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { Types } from 'mongoose';
@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}
  create(createReservationDto: CreateReservationDto) {
    return this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: '123',
    });
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
