import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Any module that imports the PrismaModule will have access to PrismaService
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
