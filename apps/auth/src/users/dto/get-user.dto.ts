import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
