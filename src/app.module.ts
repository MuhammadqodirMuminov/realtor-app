import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { HomeModule } from './home/home.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserInterceptor } from './user/interceptor/user.interceptor';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: UserInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
