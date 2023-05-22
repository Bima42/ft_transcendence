import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { generateUsername } from 'unique-username-generator';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService
	) {}

	async getUserDatasFrom42Api(req: RequestWithUser) {
		// Query to /oauth/authorize made by frontend with the custom url
		// We get here after user has accepted to share his data with our app

		// Get code from query params
		const { code } = req.query;

		// POST request to /oauth/token to get access_token, must be on server side
		const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				grant_type: 'authorization_code',
				client_id: process.env.FORTYTWO_API_UID,
				client_secret: process.env.FORTYTWO_API_SECRET,
				code: code,
				redirect_uri: process.env.FORTYTWO_API_CALLBACK,
			}),
		});
		const tokenData = await tokenResponse.json();

		// We can use the token to make requests to the API
		// GET request to /v2/me to get user data
		const userDataResponse = await fetch('https://api.intra.42.fr/v2/me', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`,
			},
		});
		return userDataResponse.json();
	}

	storeTokenInCookie(user: User, res: Response) {
		const token = this._createToken(user);

		res.cookie(process.env.JWT_COOKIE, token.access_token, {
			maxAge: 1000 * 60 * 60 * 24, // 1 day
			secure: true,
			sameSite: 'none',
		});

		res.cookie('choco',
			"1 - Laissez ramollir le beurre à température ambiante. Dans un saladier, malaxez-le avec le sucre.\n" +
			"2 - Ajoutez l'oeuf et éventuellement le sucre vanillé.\n" +
			"3 - Versez progressivement la farine, la levure chimique, le sel et les pépites de chocolat. Mélangez bien.\n" +
			"4 - Beurrez une plaque allant au four ou recouvrez-la d'une plaque de silicone. À l'aide de deux cuillères à soupe ou simplement avec les mains, formez des noix de pâte en les espaçant car elles s'étaleront à la cuisson.\n" +
			"Pour finir\n" +
			"Faites cuire 8 à 10 minutes à 180°C soit thermostat 6. Il faut les sortir dès que les contours commencent à brunir.", {
			maxAge: 1000 * 60 * 60 * 24, // 1 day
			secure: true,
			sameSite: 'none',
		});
	}

	async findOrCreate({username, email, firstName, lastName, phone, fortyTwoId, avatar}: {
		username: string,
		email: string,
		firstName: string,
		lastName: string,
		phone: string,
		fortyTwoId: number,
		avatar: string
	}): Promise<{user: User, firstLogin: boolean}> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: email
			}
		});

		if (!user) {
			const data = {
				username: username,
				email: email,
				firstName: firstName,
				lastName: lastName,
				phone: phone,
				fortyTwoId: fortyTwoId,
				avatar: avatar
			}
			const newUser = await this.usersService.create(data, username);
			return {
				user: newUser,
				firstLogin: true
			}
		}
		else {
			return {
				user: user,
				firstLogin: false
			}
		}
	}

	_createToken(user: any) {
		const payload = {sub: parseInt(user.id), email: user.email};
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

	async logout(res: Response) {
		res.clearCookie(process.env.JWT_COOKIE);
		res.clearCookie('choco')
		res.status(200).send('Sign out success');
	}
}
