import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SchoolAuthGuard extends AuthGuard('42') {}
