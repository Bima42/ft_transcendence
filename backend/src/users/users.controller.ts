import { Controller, Get } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<Array<User>> {
    return this.usersService.getAllUsers();
  }
}

//TODO : Remove this controller, only used to see datas stored in db
