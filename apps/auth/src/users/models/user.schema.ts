import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop({
    required: true,
  })
  name: string;
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @Prop()
  password: string;
  @Prop()
  providerId: string;
  @Prop()
  themes: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
