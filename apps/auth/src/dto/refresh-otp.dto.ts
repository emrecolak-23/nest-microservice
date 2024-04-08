import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UseCase } from '../otp/types/use-case.type';

export class RefreshOtpDto {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  useCase: UseCase;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
