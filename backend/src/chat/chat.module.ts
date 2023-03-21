
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChatGateway } from './channel.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { UsersMiddleware } from '../users/middlewares/users.middleware';

@Module({
  imports: [UsersModule],
  providers: [PrismaService, ChannelService, ChatGateway],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsersMiddleware).forRoutes(ChannelController);
  }
}
