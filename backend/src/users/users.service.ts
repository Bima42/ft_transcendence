import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { toUserDto } from '../shared/mapper';
import { LoginUserDto } from './dto/user-login.dto';
import { comparePasswords } from '../shared/utils';
import { CreateUserDto } from './dto/user.create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
  ) {}

  /**
   * Function takes a UserEntity object and returns a UserDto object
   *
   * @param options: object
   */
  async findOne(options?: object): Promise<UserDto> {
    const user = await this.usersRepo.findOne(options);
    return toUserDto(user);
  }

  /**
   * Function takes a username and password and returns a UserDto object
   * used later when the user wants to log in to the application
   *
   * @param username: string
   * @param password: string
   */
  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // compare the password entered by the user with the hashed password stored in the database
    const isMatch = await comparePasswords(user.password, password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    return toUserDto(user);
  }

  async findByPayload({ username }: any): Promise<UserDto> {
    return await this.findOne({
      where: {
        username,
      },
    });
  }

  /**
   * Function takes a CreateUserDto object and returns a UserDto object
   * used when the user wants to register to the application
   *
   * @param userData: CreateUserDto
   */
  async create(userData: CreateUserDto): Promise<UserDto> {
    const { username, password, email, phoneNumber } = userData;
    const userInDb = await this.usersRepo.findOne({
      where: { username, email },
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // create a new user using create() method from the repository
    const newUser: UserEntity = await this.usersRepo.create({
      username,
      password,
      email,
      phoneNumber,
    });
    await this.usersRepo.save(newUser);

    return toUserDto(newUser);
  }
}
