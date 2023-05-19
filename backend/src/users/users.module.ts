import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersMiddleware } from './middlewares/users.middleware';
import { AuthService } from '../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { UserStatsController } from './stats/userstats.controller';
import { UserStatsService } from './stats/userstats.service';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './friends/friends.service';
import { ChatModule } from 'src/chat/chat.module';

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
	forwardRef(() => ChatModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController, UserStatsController, FriendsController],
  providers: [
    UsersService,
    UserStatsService,
    FriendsService,
    PrismaService,
    UsersMiddleware,
    AuthService,
  ],
  exports: [UsersService, UsersMiddleware, AuthService, FriendsService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsersMiddleware)
      .forRoutes(UsersController, UserStatsController, FriendsController);
  }
}
