import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../../common/validation-message/length-validation.message';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { emailValidationMessgae } from '../../common/validation-message/email-validation-messgae';
import { Exclude } from "class-transformer";
import { RolesEnum } from "../../common/const/roles.const";
import { Exclude } from 'class-transformer';
import { ReservationsModel } from '../../reservations/entity/reservations.entity';

@Entity('users')
export class UsersModel extends BaseModel {
  @Column({
    length: 20,
    unique: false,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 10, {
    message: lengthValidationMessage,
  })
  name: string;

  @Column({
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 20, {
    message: lengthValidationMessage,
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  role: RolesEnum;
  @OneToMany(() => ReservationsModel, (reservation) => reservation.userId)
  reservations: ReservationsModel[];
}
