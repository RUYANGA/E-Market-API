import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './shared/email/email.module';
import { InfrastructureModule } from './shared/infrastructure/infrastructure.module';

@Module({
  imports: [AuthModule, PrismaModule, EmailModule, InfrastructureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
