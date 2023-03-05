import {BadRequestException, Injectable} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
      private readonly prismaService: PrismaService,
      private readonly jwtService: JwtService
  ) {}

  async createOrValidateUser({ username, email, fortyTwoId, avatar }: {
    username: string,
    email: string,
    fortyTwoId: number,
    avatar: string
  }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) {
      return this.prismaService.user.create({
        data: {
          username,
          email,
          fortyTwoId,
          avatar
        }
      });
    }
    else {
      return this.prismaService.user.update({
         where: {
           id: user.id
         },
         data: {
           username,
           email,
           fortyTwoId,
           avatar
         }
      });
    }
  }

  _createToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(
          payload,
          {
            secret: process.env.JWT_KEY,
            expiresIn: '1d'
          }),
    }
  }

  verifyToken(token: string) {
    if (!token) {
      return new BadRequestException('No token provided');
    }
    return this.jwtService.verify(
        token, {
          secret: process.env.JWT_KEY
    });
  }
}
