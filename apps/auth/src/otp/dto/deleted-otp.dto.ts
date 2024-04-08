import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { UseCase } from '../types/use-case.type';

export class DeletedOtpDto {
  @IsString()
  @Type(() => String)
  useCase: UseCase;

  @Type(() => Types.ObjectId)
  userId: Types.ObjectId;
}
