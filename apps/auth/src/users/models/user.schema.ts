import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  providerId: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
