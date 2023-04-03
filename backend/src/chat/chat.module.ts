
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChatGateway } from './channel.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { UsersMiddleware } from '../users/middlewares/users.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { MessageService } from './messages.service';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [PrismaService, MessageService, ChannelService, ChatGateway],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsersMiddleware).forRoutes(ChannelController);
  }
}
