import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from './entities/token.entity';

import { TokenType } from './enums/token-type.enum';
import {
  generateOTP,
  generatePasswordResetToken,
} from 'src/utils/generate-token';
import { OTP_EXPIRATION_TIME, PASSWORD_RESET_EXP_TIME } from 'src/constants';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  // Overwrite previous otp if it exists, else create a new one
  async createEmailVerificationToken(userId: string): Promise<UserToken> {
    const otp = generateOTP();

    // First try to find existing token
    const existingToken = await this.userTokenRepository.findOne({
      where: { userId, type: TokenType.EMAIL_VERIFICATION },
    });

    if (existingToken) {
      // Update existing token
      existingToken.token = otp.toString();
      existingToken.expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);
      return await this.userTokenRepository.save(existingToken);
    }

    // Create new token
    const newToken = this.userTokenRepository.create({
      userId,
      token: otp.toString(),
      type: TokenType.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + OTP_EXPIRATION_TIME),
    });

    return await this.userTokenRepository.save(newToken);
  }

  // Overwrite previous token if it exists, else create a new one
  async createPasswordResetToken(userId: string): Promise<UserToken> {
    const resetToken = generatePasswordResetToken();

    // First try to find existing token
    const existingToken = await this.userTokenRepository.findOne({
      where: { userId, type: TokenType.PASSWORD_RESET },
    });

    if (existingToken) {
      // Update existing token
      existingToken.token = resetToken;
      existingToken.expiresAt = new Date(Date.now() + PASSWORD_RESET_EXP_TIME);
      return await this.userTokenRepository.save(existingToken);
    }

    // Create new token
    const newToken = this.userTokenRepository.create({
      userId,
      token: resetToken,
      type: TokenType.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + PASSWORD_RESET_EXP_TIME),
    });

    return await this.userTokenRepository.save(newToken);
  }

  async findTokenById(tokenId: string): Promise<UserToken | null> {
    return await this.userTokenRepository.findOne({
      where: { id: tokenId },
      relations: ['user'],
    });
  }

  async findTokenByUserId(
    userId: string,
    type: TokenType,
  ): Promise<UserToken | null> {
    return await this.userTokenRepository.findOne({
      where: { userId, type },
      relations: ['user'],
    });
  }

  async deleteTokenById(tokenId: string): Promise<boolean> {
    const result = await this.userTokenRepository.delete(tokenId);
    return result.affected ? result.affected > 0 : false;
  }

  async deleteTokensByUserId(userId: string, type: TokenType): Promise<number> {
    const result = await this.userTokenRepository.delete({ userId, type });
    return result.affected || 0;
  }

  async deleteExpiredTokens(): Promise<number> {
    const result = await this.userTokenRepository
      .createQueryBuilder()
      .delete()
      .from(UserToken)
      .where('expiresAt <= :now', { now: new Date() })
      .execute();

    return result.affected || 0;
  }
}
