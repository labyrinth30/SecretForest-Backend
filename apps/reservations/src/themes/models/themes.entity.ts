import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Slots } from '../../slots/models/slots.entity';
@Entity()
export class Themes extends AbstractEntity<Themes> {
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

  @OneToMany(() => Slots, (slot) => slot.theme)
  slots: Slots[]; // 테마의 슬롯
}
