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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/auth/google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiQuery({ name: 'token', required: true })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT tokens after successful Google authentication.',
  })
  async googleAuthCallback(@Query('token') token: string, @Res() res) {
    if (!token) return res.redirect(process.env.ORIGIN);
    const tokens = await this.userService.verifyGoogleSignIn(token);
    res.json(tokens);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterInputDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: User,
  })
  async create(@Body() userData: RegisterInputDto): Promise<User> {
    return await this.userService.register(userData);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Returns authentication token.',
    type: AuthTokenOutput,
  })
  async login(@Body() credential: LoginDto): Promise<AuthTokenOutput> {
    return await this.userService.login(credential);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiBody({ type: VerifyEmailInputDto })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully.',
    type: User,
  })
  async verifyEmail(
    @Body() verifyEmailInput: VerifyEmailInputDto,
  ): Promise<User | null> {
    return await this.userService.verifyEmail(verifyEmailInput);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password recovery link' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password recovery email sent.' })
  async requestPasswordRecovery(@Body() dto: ForgotPasswordDto) {
    return await this.userService.requestPasswordRecovery(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset.',
    type: User,
  })
  async resetPassword(
    @Body() resetPasswordData: ResetPasswordDto,
  ): Promise<User | null> {
    return await this.userService.resetPassword(resetPasswordData);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile returned.',
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: User) {
    return this.userService.getProfile(user.email);
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile and info' })
  @ApiBody({ type: UserInfoDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated.',
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetUser() user: User,
    @Body() updateUserDto: Partial<User> & Partial<UserInfoDto>,
  ) {
    return this.userService.updateProfile(user.email, updateUserDto);
  }
}
