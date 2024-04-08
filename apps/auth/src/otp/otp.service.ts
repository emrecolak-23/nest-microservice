import { Injectable } from '@nestjs/common';
import { CreateOtpDto, DeletedOtpDto } from './dto';
import { OtpRepository } from './otp.repository';
import { Types } from 'mongoose';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  async create(createOtpDto: CreateOtpDto) {
    await this.deleteRecentOtp({
      userId: createOtpDto.user._id,
      useCase: createOtpDto.useCase,
    });
    const newToken = await this.otpRepository.create({
      userId: createOtpDto.user._id,
      useCase: createOtpDto.useCase,
      expiresAt: new Date(Date.now() + 60000),
      token: this.generateOtp(),
    });

    return newToken.token;
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async verifyOtp(otp: number, userId: Types.ObjectId) {
    return await this.otpRepository.findOne({ token: otp, userId });
  }

  async findOtp(otp: number) {
    return await this.otpRepository.findOne({ token: otp });
  }

  async deleteRecentOtp(deletedOtpDto: DeletedOtpDto) {
    try {
      return await this.otpRepository.findOneAndDelete(deletedOtpDto);
    } catch (err) {
      return;
    }
  }
}
