import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSlotDto {
  @IsNotEmpty()
  themeId: number;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
