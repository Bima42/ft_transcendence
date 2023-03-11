import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [
      AuthController
  ],
  providers: [
      AuthService,
      PrismaService,
      UsersService,
      JwtService,
  ],
})
export class AuthModule {}
