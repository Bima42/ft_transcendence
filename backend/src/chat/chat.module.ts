
import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService, ChannelService],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChatModule {}
