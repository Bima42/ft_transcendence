import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @JwtStrategy : Guard typically uses a Strategy to validate the JWT
 *
 * @AuthGuard: Have a canActivate() method from the CanActivate interface
 * This method is called by NestJS before a route is activated : it returns a boolean value that determines whether the route should be activated or not
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
