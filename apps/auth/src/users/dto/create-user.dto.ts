import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RolesEnum } from '@app/common';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  providerId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  @IsOptional()
  password: string;
}
