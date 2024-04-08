import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { OtpDocument } from './models/otp.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OtpRepository extends AbstractRepository<OtpDocument> {
  protected readonly logger = new Logger(OtpRepository.name);

  constructor(@InjectModel(OtpDocument.name) tokenModel: Model<OtpDocument>) {
    super(tokenModel);
  }
}
