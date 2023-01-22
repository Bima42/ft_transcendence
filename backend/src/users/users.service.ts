import {ConflictException, Injectable} from '@nestjs/common';
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

  async create(data: any): Promise<User> {
    // check if a user with the same username or email already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });
    if (existingUser) {
      throw new ConflictException(
        'A user with the same username or email already exists',
      );
    }
    // create a new user
    return this.usersRepository.save(data);
  }
}
