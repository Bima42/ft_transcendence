import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { UsersService } from '../users/users.service';
import { FortyTwoStrategy } from './fortytwo.strategy';

@Module({
  imports: [
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_KEY,
        signOptions: { expiresIn: '1d' },
      }),
  ],
  controllers: [
      AuthController
  ],
  providers: [
      AuthService,
      PrismaService,
      UsersService,
      JwtService,
      FortyTwoStrategy,
  ],
})
export class AuthModule {}
