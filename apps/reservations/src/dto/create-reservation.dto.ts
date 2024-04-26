import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  userId: number; // 고객 ID

  @IsNotEmpty()
  slotId: number; // 예약 슬롯 ID

  @IsNotEmpty()
  @IsDateString()
  date: Date; // 예약 날짜 및 시간

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  participants: number; // 참가자 수

  @IsOptional()
  @IsString()
  notes: string; // 특별 요청 사항 (선택 사항)
}
