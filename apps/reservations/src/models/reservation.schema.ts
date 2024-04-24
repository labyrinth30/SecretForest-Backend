import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class ReservationDocument extends AbstractDocument {
  @Prop({ required: true })
  userId: string; // 고객 ID

  @Prop({ required: true })
  themeId: string; // 테마 ID

  @Prop({ required: true })
  date: Date; // 예약 날짜 및 시간

  @Prop({ required: true })
  participants: number; // 참가자 수

  @Prop()
  notes: string; // 특별 요청 사항 (선택 사항)

  @Prop({ default: Date.now })
  createdAt: Date; // 예약 생성 시간

  @Prop({ default: false })
  confirmed: boolean; // 예약 확인 상태
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
