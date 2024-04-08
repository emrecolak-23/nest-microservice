import { AbstractDocument } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { UseCase } from '../types/use-case.type';
import { UserDocument } from '../../../../../libs/common/src/models/user.schema';
import { Types } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'otps',
  expires: '3m',
})
export class OtpDocument extends AbstractDocument {
  @Prop()
  token: number;

  @Prop({ type: Types.ObjectId, ref: 'users' })
  userId: UserDocument['_id'];

  @Prop()
  expiresAt: Date;

  @Prop({ type: String, enum: UseCase })
  useCase: UseCase;

  @Prop()
  isEmailToken?: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(OtpDocument);
