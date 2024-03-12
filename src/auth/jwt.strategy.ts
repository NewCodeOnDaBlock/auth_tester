import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './auth.constant';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const refreshToken = payload.refreshToken;
    const userId = payload.sub;

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    // this will check if the stored hashed refresh token matches the one from the payload.
    // for security purposes I decided to just hash the refresh token as well since it's data saved into the database
    const isRefreshTokenValid = await this.usersService.compareRefreshToken(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return user;
  }
}
