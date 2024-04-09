import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './users/dto';
import { UsersService } from './users/users.service';
import { OtpService } from './otp/otp.service';
import { UseCase } from './otp/types/use-case.type';
import { NOTIFICATIONS_SERVICE, UserDocument } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  async signUp(newUser: SignUpDto) {
    const registeredUser = await this.usersService.getUserByEmail(
      newUser.email,
    );
    if (!registeredUser) {
      return await this.usersService.create({
        ...newUser,
        roles: ['user'],
      });
    } else if (!registeredUser.isEmailVerified) {
      return registeredUser;
    } else {
      throw new BadRequestException('Email already exists');
    }
  }

  async verifyEmail(email: string, otp: number) {
    const registeredUser = await this.usersService.getUserByEmail(email);

    if (!registeredUser) {
      throw new NotFoundException('User not found');
    }
    const existingOtp = await this.otpService.verifyOtp(
      otp,
      registeredUser._id,
    );
    if (!existingOtp) {
      throw new NotFoundException('Otp not found');
    }

    const verifiedUser = await this.usersService.setVerifyEmail(
      registeredUser._id,
    );
    return verifiedUser;
  }

  async createOtp(user: UserDocument, useCase: UseCase) {
    const newToken = await this.otpService.create({
      user: user,
      useCase,
      isEmailToken: true,
    });

    this.notificationService.emit('notify_email', {
      email: user.email,
      text: `Your OTP is ${newToken}`,
    });
  }

  async generateOtp(email: string, useCase: UseCase) {
    const registeredUser = await this.usersService.getUserByEmail(email);
    if (!registeredUser) {
      throw new NotFoundException('User not found');
    }

    await this.createOtp(registeredUser, useCase);
  }

  async updatePassword(newPassword: string, otp: number) {
    const token = await this.otpService.findOtp(otp);
    const updatedUser = this.usersService.updatePassword(
      token.userId,
      newPassword,
    );

    return updatedUser;
  }
}
