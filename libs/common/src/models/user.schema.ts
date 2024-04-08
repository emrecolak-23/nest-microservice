import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Exclude } from 'class-transformer';

@Schema({ versionKey: false, timestamps: true, collection: 'users' })
export class UserDocument extends AbstractDocument {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ default: false, required: false })
  isEmailVerified?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
