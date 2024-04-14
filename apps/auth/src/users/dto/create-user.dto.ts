import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

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
