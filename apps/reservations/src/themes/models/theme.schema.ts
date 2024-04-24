import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class ThemeDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string; // 테마 이름

  @Prop({ required: true })
  description: string; // 테마 설명

  @Prop({ required: true })
  price: number; // 테마 가격

  @Prop({ required: true })
  difficulty: number; // 난이도

  @Prop({ required: true })
  time: number; // 소요 시간

  @Prop({ required: true })
  fear: number; // 공포도

  @Prop({ required: true })
  capacity: number; // 수용 인원
}

export const ThemeSchema = SchemaFactory.createForClass(ThemeDocument);
