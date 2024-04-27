import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Slot } from '../../slots/models/slot.entity';
@Entity()
export class Theme extends AbstractEntity<Theme> {
  @Column()
  title: string; // 테마 이름

  @Column()
  description: string; // 테마 설명

  @Column()
  price: number; // 테마 가격

  @Column()
  difficulty: number; // 난이도

  @Column()
  time: number; // 제한 시간

  @Column()
  fear: number; // 공포도

  @Column()
  capacity: number; // 수용 인원

  @OneToMany(() => Slot, (slot) => slot.theme)
  slots: Slot[]; // 테마의 슬롯
}
