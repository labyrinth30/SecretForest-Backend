import { Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from '../../common/entity/base.entity';
import { IsNumber, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../../common/validation-message/length-validation.message';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { numberValidationMessage } from '../../common/validation-message/number-validation-message';
import { ReservationsModel } from "../../reservations/entity/reservations.entity";

@Entity()
export class ThemesModel extends BaseModel {
  @Column({
    length: 20,
    unique: false,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  title: string;

  @Column()
  @IsNumber({}, { message: numberValidationMessage })
  fear: number;

  @Column()
  @IsNumber({}, { message: numberValidationMessage })
  difficulty: number;

  @OneToMany(() => ReservationsModel, (reservation) => reservation.themeId)
  reservations: ReservationsModel[];
}
