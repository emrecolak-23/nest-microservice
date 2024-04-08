import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { TokenSchema, OtpDocument } from './models/otp.schema';
import { OtpRepository } from './otp.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: OtpDocument.name,
        schema: TokenSchema,
      },
    ]),
    LoggerModule,
  ],
  controllers: [OtpController],
  providers: [OtpService, OtpRepository],
  exports: [OtpService],
})
export class OtpModule {}
