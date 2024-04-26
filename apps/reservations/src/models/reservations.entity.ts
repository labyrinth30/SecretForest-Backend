import { AbstractEntity, Users } from '@app/common';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Slot } from '../slots/models/slot.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class Reservations extends AbstractEntity<Reservations> {
  @Column()
  userId: number; // 고객 ID

  @OneToOne(() => Slot, (slot) => slot.reservation)
  slotId: number; // 예약 슬롯 ID

  @Column()
  date: Date; // 예약 날짜 및 시간

  @Column()
  participants: number; // 참가자 수

  @Column()
  @IsOptional()
  notes: string; // 특별 요청 사항 (선택 사항)

  @Column({ default: false })
  confirmed: boolean; // 예약 확인 상태
}
