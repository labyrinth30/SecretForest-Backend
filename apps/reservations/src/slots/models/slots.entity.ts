import { AbstractEntity } from '@app/common';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Reservations } from '../../models/reservations.entity';
import { Themes } from '../../themes/models/themes.entity';

@Entity()
export class Slots extends AbstractEntity<Slots> {
  @ManyToOne(() => Themes, (theme) => theme.slots)
  theme: Themes; // 해당 슬롯이 속한 테마의 ID

  @Column()
  startTime: Date; // 테마 시작 시간

  @Column({
    default: 1,
  })
  available: boolean; // 슬롯의 예약 가능 여부

  @OneToOne(() => Reservations, (reservation) => reservation.slotId)
  reservation: Reservations; // 예약 정보
}
