import { ArrayNotEmpty, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateThemeDto {
  @IsNotEmpty()
  title: string; // 테마 이름

  @IsNotEmpty()
  description: string; // 테마 설명

  @IsNumber()
  price: number; // 테마 가격

  @IsNumber()
  difficulty: number; // 난이도

  @IsNumber()
  time: number; // 제한 시간

  @IsNumber()
  fear: number; // 공포도

  @ArrayNotEmpty()
  @IsString({ each: true })
  timetable: string[]; // 테마의 타임테이블

  @IsString()
  genre: string; // 테마 장르

  @IsString()
  imageUrl: string; // 테마 이미지
}
