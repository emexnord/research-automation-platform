import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterInputDto } from './dto/user-register.dto';
import { AuthTokenOutput } from './dto/auth-token-output.dto';
import { LoginDto } from './dto/login-input.dto';
import { User } from './entities/user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailInputDto } from './dto/verify-email-input.dto';
import { SendVerificationEmailDto } from './dto/send-verification-email.dto';
import { GetUser } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/auth/google/callback')
  // @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Query('token') token: string, @Res() res) {
    if (!token) return res.redirect(process.env.ORIGIN);
    const tokens = await this.userService.verifyGoogleSignIn(token);
    res.json(tokens);
  }

  @Post('register')
  async create(@Body() userData: RegisterInputDto): Promise<User> {
    return await this.userService.register(userData);
  }

  @Post('login')
  async login(@Body() credential: LoginDto): Promise<AuthTokenOutput> {
    return await this.userService.login(credential);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailInput: VerifyEmailInputDto,
  ): Promise<User | null> {
    return await this.userService.verifyEmail(verifyEmailInput);
  }

  @Get('verify-email/send')
  async sendVerificationEmail(
    @Query() dto: SendVerificationEmailDto,
  ): Promise<User | null> {
    return await this.userService.sendVerificationEmail(dto.email);
  }

  @Get('forgot-password')
  async requestPasswordRecovery(@Query() dto: ForgotPasswordDto) {
    return this.userService.requestPasswordRecovery(dto.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordData: ResetPasswordDto,
  ): Promise<User | null> {
    return this.userService.resetPassword(resetPasswordData);
  }

  @Put()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    return await this.userService.update(user.id, updateUserDto);
  }
}
