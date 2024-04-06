import { BaseModel } from '../../common/entity/base.entity';
import { UsersModel } from '../../users/entity/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ThemesModel } from '../../themes/entity/themes.entity';

@Entity('reservations')
export class ReservationsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.reservations)
  userId: UsersModel;
  @ManyToOne(() => ThemesModel, (user) => user.reservations)
  themeId: ThemesModel;

  @Column({
    default: false,
  })
  isConfirmed: boolean;
}
