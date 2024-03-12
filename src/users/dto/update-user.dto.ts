import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { REGEX, MESSAGES } from '../utils/app.utils';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Must be a valid email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description:
      'Password must be 8-24 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    minLength: 8,
    maxLength: 24,
  })
  @IsNotEmpty()
  @IsOptional()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  password?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiPropertyOptional({ description: 'Is email verified or not ?' })
  @IsOptional()
  emailVerified?: boolean;
}
