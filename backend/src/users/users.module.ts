import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersMiddleware } from './middlewares/users.middleware';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { UserStatsController } from './stats/userstats.controller';
import { UserStatsService } from './stats/userstats.service';

/**
 * Users module
 *
 * @imports : import PassportModule and JwtModule to use JWT strategy
 *
 * @configure : configure middleware for all routes in this users module
 * The use() method of the UsersMiddleware class is called for all routes in this module
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController, UserStatsController],
  providers: [
    UsersService,
    UserStatsService,
    PrismaService,
    UsersMiddleware,
    AuthService,
    JwtStrategy
  ],
  exports: [UsersService, UsersMiddleware, AuthService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsersMiddleware)
      .forRoutes(UsersController);
  }
}
