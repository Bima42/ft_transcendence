import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FriendsService {
	constructor(
		private readonly prismaService: PrismaService
	) {}
}