import { Injectable, ConflictException } from '@nestjs/common';
import { createTransport, type TransportOptions } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
dotenv.config();

@Injectable()
export class EmailService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.configService = configService;
  }
  async sendMail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    const transporter = createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<number>('EMAIL_USER'),
        pass: this.configService.get<number>('EMAIL_PASSWORD'),
      },
    } as TransportOptions);

    try {
      await transporter.sendMail({
        from: 'team@currentsea.ai',
        to,
        subject,
        text,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendVerificationEmail(email: string, code: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      ),
    });

    const url = `${this.configService.get(
      'EMAIL_VERIFICATION_URL',
    )}?token=${token}`;
    const text = `Thank you for signing up with CurrentSea! To complete your registration and verify your email address, please use the verification code provided below:

Verification Code: ${code}

Alternatively, you can simply click the link below to automatically verify your email address (note: the link expires in 10 minutes):

${url}

Best regards,
CurrentSea Team`;

    await this.sendMail({
      to: email,
      subject: 'Confirm Your Email Address',
      text,
    });
  }

  async resendVerificationEmail(userEmail: string) {
    const user = await this.usersService.findByEmail(userEmail);
    if (user.emailVerified) {
      throw new ConflictException('Email is already verified.');
    }
    await this.sendVerificationEmail(user.email, user.verificationCode);
  }

  async confirmVerificationCode(token: string): Promise<void> {
    const decodedToken = this.jwtService.verify(token);

    const userId = decodedToken.userId;

    const user = await this.usersService.findById(userId);

    if (!user || user.verificationCode !== token) {
      throw new Error('Invalid token or token expired');
    }

    user.emailVerified = true;
    const userData: UpdateUserDto = { emailVerified: true };

    await this.usersService.update(userData, decodedToken);
  }

  async sendPasswordResetEmail(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_RESET_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_RESET_TOKEN_EXPIRATION_TIME'),
    });

    const resetUrl = `${this.configService.get(
      'RESET_PASSWORD_URL',
    )}?token=${token}`;
    const text = `To reset your password, click here: ${resetUrl}`;

    await this.sendMail({
      to: email,
      subject: 'Password Reset',
      text,
    });
  }
}
