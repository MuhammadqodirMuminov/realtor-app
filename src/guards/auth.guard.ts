import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface IJwtPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflactor: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const rules: UserType[] = this.reflactor.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      if (rules?.length) {
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split('Bearer ')[1];
        const payload = await jwt.verify(token, 'asdfghjkl-asdfghjk-12') as IJwtPayload;

        const user = await this.prismaService.user.findUnique({where : {id : payload.userId}})

        if(!user) return false

        console.log(user);
        if(rules.includes(user.userType)) return true

        return false;
      }
    } catch (error) {
      return false;
    }

    console.log(rules);

    return true;
  }
}
