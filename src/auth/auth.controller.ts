import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}
  @Post('register')
  creat(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.create(registerAuthDto);
  }
  @Post('login')
  update(@Body() loginAuthDto: loginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  verify(@Body() verifyOtp: verifyOtpDto, @Req() req) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Invalid token or user not found');
    }

    return this.authService.verifyOtp(verifyOtp, userId);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Req() req) {
    return this.authService.profile(req);
  }
}
