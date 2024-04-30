import { AbstractEntity } from '@app/common';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
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
  @IsOptional()
  password: string;

  @Column({
    nullable: true,
  })
  providerId: string;

  @Column({ type: 'json', nullable: true })
  roles: string[];
}
