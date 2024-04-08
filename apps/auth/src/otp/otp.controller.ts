import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto } from './dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  create(@Body() createOtpDto: CreateOtpDto) {
    return this.otpService.create(createOtpDto);
  }
}
