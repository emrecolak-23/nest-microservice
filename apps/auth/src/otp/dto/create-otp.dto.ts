import { UseCase } from '../types/use-case.type';
import { IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDocument } from '../../../../../libs/common/src/models/user.schema';

export class CreateOtpDto {
  @Type(() => UserDocument)
  user: UserDocument;

  @IsString()
  @Type(() => String)
  useCase: UseCase;

  @IsBoolean()
  isEmailToken: boolean;
}
