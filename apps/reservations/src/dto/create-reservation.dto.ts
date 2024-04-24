import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsString()
  readonly userId: string; // 고객 ID

  @IsString()
  readonly themeId: string; // 테마 ID

  @IsDateString()
  @Type(() => Date)
  readonly date: Date; // 예약 날짜 및 시간

  @IsInt()
  @Min(1)
  @Max(6)
  readonly participants: number; // 참가자 수

  @IsString()
  @IsOptional()
  readonly notes?: string; // 특별 요청 사항 (선택 사항)
}
