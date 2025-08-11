import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailModule } from 'src/shared/email/email.module';
import { InfrastructureService } from 'src/shared/infrastructure/infrastructure.service';

@Module({
  imports:[EmailModule],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,EmailModule,InfrastructureService],
})
export class AuthModule {}
