import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersMiddleware } from '../users/middlewares/users.middleware';
import { TwoFaController } from './2fa/twofa.controller';
import { TwoFaService } from './2fa/twofa.service';

@Module({
  controllers: [
      AuthController,
      TwoFaController
  ],
  providers: [
      AuthService,
      TwoFaService,
      PrismaService,
      UsersService,
      JwtService,
  ],
  exports: [ AuthService ]
})
export class AuthModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsersMiddleware)
      .exclude('auth/42/callback')
      .forRoutes(AuthController, TwoFaController)
  }
}
