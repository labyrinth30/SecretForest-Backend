import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Slots } from '../slots/models/slots.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class Reservations extends AbstractEntity<Reservations> {
  @Column()
  userId: number; // 고객 ID

  @OneToOne(() => Slots, (slot) => slot.reservation)
  @JoinColumn()
  slot: Slots; // 예약 슬롯 ID

  @Column()
  participants: number; // 참가자 수

  @Column()
  @IsOptional()
  notes: string; // 특별 요청 사항 (선택 사항)

  @Column({ default: false })
  confirmed: boolean; // 예약 확인 상태
}
