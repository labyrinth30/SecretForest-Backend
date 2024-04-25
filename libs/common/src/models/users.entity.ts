import { AbstractEntity, RolesEnum } from '@app/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity()
export class Users extends AbstractEntity<Users> {
  @Column()
  name: string;
  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @Column()
  password: string;
  @Column()
  providerId: string;
  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
