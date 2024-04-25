import { AbstractEntity } from '@app/common';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Reservation } from '../../models/reservations.entity';
import { Theme } from '../../themes/models/theme.entity';

@Entity()
export class Slot extends AbstractEntity<Slot> {
  @ManyToOne(() => Theme)
  theme: Theme; // 해당 슬롯이 속한 테마의 ID

  @Column()
  startTime: Date; // 테마 시작 시간

  @Column()
  available: boolean; // 슬롯의 예약 가능 여부

  @OneToOne(() => Reservation, (reservation) => reservation.slotId)
  reservation: Reservation; // 예약 정보
}
