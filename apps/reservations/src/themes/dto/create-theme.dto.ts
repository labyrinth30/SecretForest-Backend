import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateThemeDto {
  @IsNotEmpty()
  title: string; // 테마 이름

  @IsNotEmpty()
  description: string; // 테마 설명

  @IsNumber()
  @Min(0)
  price: number; // 테마 가격

  @IsInt()
  @Min(1)
  difficulty: number; // 난이도

  @IsInt()
  @Min(1)
  time: number; // 제한 시간

  @IsInt()
  @Min(0)
  fear: number; // 공포도

  @IsInt()
  @Min(1)
  capacity: number; // 수용 인원
}
