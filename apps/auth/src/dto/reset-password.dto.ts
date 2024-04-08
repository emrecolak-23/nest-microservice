import {
  IsStrongPassword,
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
} from 'class-validator';

export class ResetPasswordDto {
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
  @IsNumber()
  @Length(100000)
  @IsNotEmpty()
  otp: number;
}
