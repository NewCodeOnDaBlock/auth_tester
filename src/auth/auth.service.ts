import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private emailService: EmailService,
    private configService: ConfigService,
    private readonly em: EntityManager,
  ) {}
  // Creates new user with newly-created verification code & code expiration date
  // then sends a verification email
  async register(createUserDto: CreateUserDto): Promise<User> {
    const verificationCode = this.generateCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 10,
    );

    const user = await this.usersService.create({
      ...createUserDto,
      email_verified: false,
      verificationCode,
      verificationCodeExpires,
    });

    await this.emailService.sendVerificationEmail(user.email, verificationCode);

    return user;
  }

  private generateCode(): string {
    const length = 6;
    const characters = '0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
  }
}
