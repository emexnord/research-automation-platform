import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import configuration from '../../config';

const config = configuration();

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: User): Promise<string> {
    const accessTokenPayload = {
      email: user.email,
      id: user.id,
      image: user.image,
      username: user.username,
      role: user.role,
    };
    // const refreshTokenPayload = { _id: user._id };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: config.jwt.accessTokenSecret,
      expiresIn: config.jwt.accessTokenExpiry,
    });
    // const refreshToken = this.jwtService.sign(refreshTokenPayload, {
    //   secret: config.jwt.refreshTokenSecret,
    //   expiresIn: config.jwt.refreshTokenExpiry,
    // });

    return accessToken;
  }
}
