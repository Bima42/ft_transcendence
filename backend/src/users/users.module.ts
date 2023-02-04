import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';

/**
 * UsersModule : module that contains all the users related logic
 *
 * @export UsersService: other modules, specifically the AuthModule, can communicate with the database to perform its function via an access to UsersService
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
