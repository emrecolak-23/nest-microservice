import { IsNumber, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyEmailDto {
  @IsNumber()
  @IsNotEmpty()
  otp: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
