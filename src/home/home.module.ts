import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [PrismaModule],
  providers: [HomeService],
  controllers: [HomeController]
})
export class HomeModule { }
