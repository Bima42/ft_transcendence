import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersMiddleware } from './middlewares/users.middleware';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersMiddleware, AuthService, JwtStrategy],
})
export class UsersModule {}
