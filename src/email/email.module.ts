import { Module } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { EmailService } from './email.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [EmailService, JwtService, ConfigService, UsersService],
  controllers: [],
  exports: [EmailService],
})
export class EmailModule {}
