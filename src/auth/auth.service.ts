import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { randomInt } from 'crypto';
import { EmailService } from 'src/shared/email/email.service';
import { InfrastructureService } from 'src/shared/infrastructure/infrastructure.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET;

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly infrastructureService: InfrastructureService,
  ) {}

  async create(registerAuthDto: RegisterAuthDto) {
    await this.infrastructureService.checkDuplicate('user', [
      { property: 'email', value: registerAuthDto.email },
    ]);
    await this.infrastructureService.checkDuplicate('user', [
      { property: 'phone', value: registerAuthDto.phone },
    ]);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerAuthDto.email },
    });

    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: registerAuthDto.name,
        email: registerAuthDto.email,
        phone: registerAuthDto.phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        phone: true,
      },
    });

    const otpCode = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await this.prisma.otp.create({
      data: {
        userId: user.id,
        otpCode,
        expiresAt,
      },
    });

    await this.emailService.sendOtpEmail(user.email, otpCode);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.username,
        role: user.role,
      },
    };
  }
  async login(loginAuthDto: loginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' },
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.username,
        role: user.role,
      },
      token,
    };
  }
  async verifyOtp(verfiyDto) {
    if (!verfiyDto.userId) {
      throw new BadRequestException('userId is required');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: verfiyDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        userId: user.id,
        otpCode: verfiyDto.otp,
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    await this.prisma.otp.delete({
      where: { id: otpRecord.id },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' },
    );

    return {
      success: true,
      message: 'Email verified successfully',
      token,
    };
  }

  async profile(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
