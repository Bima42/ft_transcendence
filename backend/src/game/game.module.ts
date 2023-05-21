import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersMiddleware } from 'src/users/middlewares/users.middleware';


@Module({
	imports: [UsersModule, AuthModule],
	providers: [PrismaService, GameService, GameGateway],
	controllers: [GameController],
	exports: [GameService],
})

export class GameModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(UsersMiddleware).forRoutes(GameController);
	}
}
