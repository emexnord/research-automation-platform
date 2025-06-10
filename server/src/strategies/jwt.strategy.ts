import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../modules/user/user.service';
import { JwtPayload } from '../modules/jwt/types/jwt.dto';
import configuration from '../config';

const config = configuration();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      return null;
    }

    return user;
  }
}
