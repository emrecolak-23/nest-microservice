import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto, GetUserDto } from './dto';
import { UsersRepository } from './users.repository';
import { hashPassword, comparePassword } from '../utils/password.util';
import { UserDocument } from '@app/common';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.usersRepository.create({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('Users not found');
    }
    const passwordIsValid = await comparePassword(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return await this.usersRepository.findOne({ email });
  }

  async getUser(getUserDto: GetUserDto) {
    return await this.usersRepository.findOne(getUserDto);
  }

  async setVerifyEmail(userId: Types.ObjectId) {
    return await this.usersRepository.findOneAndUpdate(
      {
        _id: userId,
      },
      { isEmailVerified: true },
    );
  }

  async updatePassword(userId: Types.ObjectId, newPassword: string) {
    const user = await this.usersRepository.findOne({ _id: userId });
    user.password = await hashPassword(newPassword);
    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { _id: userId },
      user,
    );

    return updatedUser;
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      email: createUserDto.email,
    });

    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }
  }
}
