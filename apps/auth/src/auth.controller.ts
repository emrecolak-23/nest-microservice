import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, UserDocument } from '@app/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UseCase } from './otp/types/use-case.type';
import { VerifyEmailDto, RefreshOtpDto, ResetPasswordDto } from './dto';
import { SignUpDto } from './users/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    const formattedUser = plainToClass(UserDocument, user);
    response.send(formattedUser);
  }

  @Post('/signup')
  async signup(@Body() request: SignUpDto) {
    const user = await this.authService.signUp(request);
    await this.authService.createOtp(user, UseCase.SIGNUP);
    return user.email;
  }

  @Post('/verify-email')
  async verifyEmail(
    @Body() request: VerifyEmailDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { otp, email } = request;
    const registeredUser = await this.authService.verifyEmail(email, otp);
    await this.authService.login(registeredUser, response);
    const formattedUser = plainToClass(UserDocument, registeredUser);
    response.send(formattedUser);
  }

  @Post('/refresh-otp')
  async resendOtp(@Body() request: RefreshOtpDto) {
    const { email, useCase } = request;
    await this.authService.generateOtp(email, useCase);
    return email;
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication');
    response.send('Logged out');
  }

  @Post('/forgot-password-request')
  async sendEmailForgotPassword(@Body() request: { email: string }) {
    await this.authService.generateOtp(request.email, UseCase.FORGOT_PASSWORD);
    return request.email;
  }

  @Post('/reset-password')
  async resetPassword(@Body() request: ResetPasswordDto) {
    const { newPassword, otp } = request;
    const user = await this.authService.updatePassword(newPassword, otp);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
