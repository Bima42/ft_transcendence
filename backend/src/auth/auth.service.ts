import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { UserDto } from '../users/dto/user.dto';
import { LoginUserDto } from '../users/dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param userDto: CreateUserDto
   */
  async register(userDto: CreateUserDto) {
    let status: RegistrationStatus = {
      success: true,
      message: 'User has been registered successfully',
    };

    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }

  /**
   * Login function
   * Here we can decide what data we want to return to the client-side app upon a successful login
   *
   * @param loginUserDto
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByLogin(loginUserDto);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = this._createToken(user);

    return {
      username: user.username,
      ...token,
      status: 'success',
    };
  }

  /**
   * Validate user function
   * This function is called by the JwtStrategy.validate() function once a token is validated by Passport.js middleware.
   * @param payload
   */
  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  /**
   * Creation token function
   * We can also return any arbitrary user fields we wish to return to the client-side app upon a successful login.
   * @param username
   * @private
   */
  private _createToken({ username }: UserDto): any {
    const expiresIn = process.env.EXPIRES_IN;

    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);

    return {
      expiresIn,
      accessToken,
    };
  }
}
