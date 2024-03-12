import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { REGEX, MESSAGES } from '../utils/app.utils';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Must be a valid email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password must be 8-24 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    minLength: 8,
    maxLength: 24,
  })
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  password: string;

  @ApiProperty({
    description: 'Must match the password.',
    minLength: 8,
    maxLength: 24,
  })
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  confirmPassword: string;

  @ApiProperty({ description: 'The user profile' })
  email_verified: false;

  @ApiProperty({ nullable: true, minLength: 6, maxLength: 6 })
  verificationCode?: string;

  @ApiProperty({ nullable: true })
  verificationCodeExpires?: Date;
}
