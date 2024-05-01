import { AbstractEntity } from '@app/common';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Reservations } from '../../models/reservations.entity';
import { Theme } from '../../themes/models/theme.entity';

@Entity()
export class Slot extends AbstractEntity<Slot> {
  @ManyToOne(() => Theme, (theme) => theme.slots)
  theme: Theme; // 해당 슬롯이 속한 테마의 ID

  @Column()
  startTime: Date; // 테마 시작 시간

  @Column({
    default: 1,
  })
  available: boolean; // 슬롯의 예약 가능 여부

  @OneToOne(() => Reservations, (reservation) => reservation.slotId)
  reservation: Reservations; // 예약 정보
}
