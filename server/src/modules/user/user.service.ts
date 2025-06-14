import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import configuration from '../../config';
import { LoginDto } from './dto/login-input.dto';
import { User } from './entities/user.entity';
import { JwtAuthService } from '../jwt/jwt.service';
import { RegisterInputDto } from './dto/user-register.dto';
import { AuthProvider } from './entities/user.interface';
import { UserRepository } from './user.repository';
import { AuthTokenOutput } from './dto/auth-token-output.dto';
import { TokenService } from '../shared/token.service';
import { TokenType } from '../shared/enums/token-type.enum';
import { VerifyEmailInputDto } from './dto/verify-email-input.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { generateSalt, hashPassword } from 'src/utils/password';

const config = configuration();

@Injectable()
export class UserService {
  private googleClient: OAuth2Client;
  private logger = new Logger(UserService.name);

  constructor(
    private readonly jwtService: JwtAuthService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {
    this.googleClient = new OAuth2Client(config.google.clientId);
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    return this.userRepository.findByEmail(normalizedEmail);
  }

  async login(credentials: LoginDto): Promise<AuthTokenOutput> {
    const { email, password } = credentials;
    const user = await this.userRepository.findOneWithSensitiveFields(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('User not verified');
    }

    const hashedPassword = await hashPassword(password, user.salt);

    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await this.jwtService.login(user);
    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...(user.name && { name: user.name }),
        ...(user.image && { image: user.image }),
        ...(user.username && { username: user.username }),
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async verifyGoogleSignIn(token: string): Promise<AuthTokenOutput | null> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: config.google.clientId,
      });

      const payload = ticket.getPayload();
      const { providerId, email, name, picture: image } = payload as any;
      const provider = AuthProvider.GOOGLE;

      const user = await this.userRepository.findByEmail(email);

      if (user) {
        const alreadyLinked = user.authProviders?.some(
          (auth) => auth.provider === provider,
        );

        // 1. User exists but Google provider not linked, add it
        if (!alreadyLinked) {
          await this.userRepository.updateById(user.id, {
            authProviders: [...user.authProviders, { provider, providerId }],
          });
        }

        const accessToken = await this.jwtService.login(user);
        return {
          accessToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            username: user.username,
            role: user.role,
          },
        };
      }

      // 2. User does not exist, create with Google as first provider
      const newUser = await this.userRepository.create({
        email,
        name,
        image,
        authProviders: [{ provider, providerId }],
      });

      // await this.emailService.sendWelcomeEmail(email);
      const accessToken = await this.jwtService.login(newUser);
      return {
        accessToken,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          username: newUser.username,
          role: newUser.role,
        },
      };
    } catch (error) {
      this.logger.error(`Google Sign-In Error: ${error.message}`);
      return null;
    }
  }

  async register(registerInputDto: RegisterInputDto): Promise<User> {
    const { email, password } = registerInputDto;
    const normalizedEmail = email.toLowerCase();
    const isUserFound = await this.userRepository.findByEmail(normalizedEmail);

    if (isUserFound) {
      throw new BadRequestException('Email already exists');
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const user = await this.userRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
      salt,
    });

    // console.log('user', user);

    const verification_token =
      await this.tokenService.createEmailVerificationToken(user.id.toString());

    // Send verification email
    this.logger.log(`otp ${verification_token.token}`);
    // await this.emailService.sendEmailVerificationOTP({
    //   email: user.email,
    //   otp: verification_token.token,
    // });

    return user;
  }

  async sendVerificationEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }
    const verification_token =
      await this.tokenService.createEmailVerificationToken(user.id.toString());
    // await this.emailService.sendEmailVerificationOTP({
    //   email: user.email,
    //   otp: verification_token.token,
    // });

    return user;
  }

  async verifyEmail({ email, otp }: VerifyEmailInputDto): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }

    const verification_token = await this.tokenService.findTokenByUserId(
      user.id.toString(),
      TokenType.EMAIL_VERIFICATION,
    );

    if (!verification_token || verification_token.token !== otp) {
      throw new UnauthorizedException('Invalid verification token');
    }

    if (
      verification_token.expiresAt &&
      new Date(verification_token.expiresAt.toString()) < new Date()
    ) {
      throw new GoneException('Verification token expired'); // 410 Gone exeption when token is expired
    }

    // await this.emailService.sendWelcomeEmail(email);
    await this.tokenService.deleteTokenById(verification_token.id);

    const userId = verification_token.userId;
    return this.userRepository.updateById(userId, { isVerified: true });
  }

  async requestPasswordRecovery(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.tokenService.createPasswordResetToken(
      user.id.toString(),
    );

    const resetLink = `${config.client.resetPasswordUrl}?code=${token.token}&email=${user.email}`;
    // await this.emailService.sendPasswordRecoveryEmail({
    //   email: user.email,
    //   link: resetLink,
    // });
  }

  async resetPassword({
    email,
    resetCode,
    newPassword,
  }: ResetPasswordDto): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reset_token = await this.tokenService.findTokenByUserId(
      user.id,
      TokenType.PASSWORD_RESET,
    );

    if (!reset_token || reset_token.token !== resetCode) {
      throw new ForbiddenException('Invalid reset token');
    }
    if (
      reset_token.expiresAt &&
      new Date(reset_token.expiresAt.toString()) < new Date()
    ) {
      throw new GoneException('Reset token expired'); // 410 Gone exeption when token is expired
    }

    const userId = reset_token.userId;
    const salt = generateSalt();
    const hashedPassword = await hashPassword(newPassword, salt);

    await this.tokenService.deleteTokenById(reset_token.id);

    return this.userRepository.updateById(userId, {
      password: hashedPassword,
      salt,
    });
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.userRepository.updateById(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePicture(id: string, url: string): Promise<User | null> {
    try {
      const updatedUser = await this.userRepository.updateById(id, {
        image: url,
      });
      return updatedUser;
    } catch (err) {
      return err;
    }
  }
}
