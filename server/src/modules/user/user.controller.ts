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
import { GetUser } from './decorators/user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
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

  @Post('forgot-password')
  async requestPasswordRecovery(@Body() dto: ForgotPasswordDto) {
    return await this.userService.requestPasswordRecovery(dto.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordData: ResetPasswordDto,
  ): Promise<User | null> {
    return await this.userService.resetPassword(resetPasswordData);
  }
  
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned.' })
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: User) {
    return this.userService.getProfile(user.email);
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile and info' })
  @ApiBody({ type: UserInfoDto })
  @ApiResponse({ status: 200, description: 'User profile updated.' })
  @UseGuards(JwtAuthGuard)
  async updateProfile(@GetUser() user: User, @Body() updateUserDto: Partial<User> & Partial<UserInfoDto>) {
    return this.userService.updateProfile(user.email, updateUserDto);
  }
}
