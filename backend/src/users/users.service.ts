import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async getAllUsers(): Promise<Array<User>> {
    return this.usersRepository.find({});
  }

  // TODO : Add some protection if a user or mail already exist
  async create(data: any): Promise<User> {
    return this.usersRepository.save(data);
  }
}
