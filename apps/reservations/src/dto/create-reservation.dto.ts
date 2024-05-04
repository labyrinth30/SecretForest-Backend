import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  slotId: number; // 예약 슬롯 ID

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  participants: number; // 참가자 수

  @IsOptional()
  @IsString()
  notes: string; // 특별 요청 사항 (선택 사항)
}
