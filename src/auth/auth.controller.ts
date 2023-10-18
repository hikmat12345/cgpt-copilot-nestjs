import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Get, 
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { GetUser } from './decorator';
import {  JwtGuard } from './guard';
import { aipuser } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  async forgetPassword(@Body() dto: AuthDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: AuthDto) {
    return this.authService.resetPassword(dto.email, dto.password);
  }
  @UseGuards(JwtGuard)
  @Get('verify-email')
  async verifyEmail() {
    return {
      message: 'Email verified',
    };
  }

  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@Req() request: Request) {
    return this.authService.logout(request);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@GetUser() user:aipuser ) {
    console.log(user, "user")
      return this.authService.profile(user);
  }
}
