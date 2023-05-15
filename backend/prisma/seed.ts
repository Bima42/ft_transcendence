import { Chat, ChatMessage, Friendship, Game, PrismaClient, User, UserGame, Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()

/******************************************************************************/
/***************************** USERS ******************************************/
/******************************************************************************/
const users: Prisma.UserUncheckedCreateInput[] = [
	{
		username: "Gege",
		email: "admin@example.com",
		avatar: `https://api.multiavatar.com/gege.png`,
		firstName: "Gerard",
		lastName: "Bouchard",
		phone: "0836656565",
		status: 'ONLINE',
		elo: 987,
	},
	{
		username: "fasel",
		email: "fasel@example.com",
		avatar: `https://api.multiavatar.com/fasel.png`,
		firstName: "Franck",
		lastName: "Ribéri",
		phone: null,
		status: 'OFFLINE',
		elo: 207,
	},
	{
		username: "Alpha_BestPongerEver",
		email: "julius@example.com",
		avatar: `https://api.multiavatar.com/alpha.png`,
		firstName: "Julius",
		lastName: "O",
		phone: null,
		status: 'OFFLINE',
		elo: 1337,
	},
	{
		username: "Xx-BullyGuy-xX",
		email: "bully@example.com",
		avatar: `https://api.multiavatar.com/bully.png`,
		firstName: "Etienne",
		lastName: "Leblanc",
		phone: null,
		status: 'OFFLINE',
		elo: 420,
	},
]

/******************************************************************************/
/***************************** FRIENDSHIPS ************************************/
/******************************************************************************/
const friendships: Prisma.FriendshipUncheckedCreateInput[] = [
	{
		status: "ACCEPTED",
		userId: 1,
		friendId: 2,
	}
]

/******************************************************************************/
/***************************** CHATS ******************************************/
/******************************************************************************/
const chats: Prisma.ChatUncheckedCreateInput[] = [
	{
		type: "PUBLIC",
		name: "General",
		password: null,
	},
	{
		type: "PUBLIC",
		name: "Tactic discussions",
		password: null,
	},
	{
		type: "PUBLIC",
		name: "PasswordIs1234",
		password: "1234", // Will be hashed
	},
	{
		type: "PRIVATE",
		name: "Team Alpha",
		password: null,
	},
]

/******************************************************************************/
/***************************** USERCHATS **************************************/
/******************************************************************************/
const userChats: Prisma.UserChatUncheckedCreateInput[] = [
	{
		chatId: 1,
		userId: 1,
		role: 'MEMBER',
		mutedUntil: null,
	},
	{
		chatId: 1,
		userId: 2,
		role: 'MEMBER',
		mutedUntil: null,
	},
	{
		chatId: 1,
		userId: 3,
		role: 'MEMBER',
		mutedUntil: null,
	},
	{
		chatId: 1,
		userId: 4,
		role: 'MEMBER',
		mutedUntil: null,
	},
	{
		chatId: 2,
		userId: 1,
		role: 'OWNER',
		mutedUntil: null,
	},
	{
		chatId: 2,
		userId: 2,
		role: 'ADMIN',
		mutedUntil: null,
	},
	{
		chatId: 3,
		userId: 2,
		role: 'OWNER',
		mutedUntil: null,
	},
	{
		chatId: 4,
		userId: 3,
		role: 'OWNER',
		mutedUntil: null,
	},
]
/******************************************************************************/
/***************************** CHATMESSAGES ***********************************/
/******************************************************************************/
const chatMessages: Prisma.ChatMessageUncheckedCreateInput[] = [
	{
		content: "One two, one two, this is a test",
		userId: 1,
		chatId: 1,
	},
	{
		content: "Test worked apparently",
		userId: 2,
		chatId: 1,
	},
	{
		content: "Thanks ! 👍",
		userId: 1,
		chatId: 1,
	},
	{
		content: "Hey guys, this channel is to discuss different tactics in Pong",
		userId: 1,
		chatId: 2,
	},
	{
		content: "This sucks",
		userId: 4,
		chatId: 2,
	},
	{
		content: "You all suck !",
		userId: 4,
		chatId: 1,
	},
	{
		content: "Team Alpha FTW",
		userId: 3,
		chatId: 4,
	},
]


/******************************************************************************/
/***************************** GAMES ******************************************/
/******************************************************************************/
async function generateGames() {

	// Only add games if none
	const games = await prisma.game.findMany({})
	if (games.length)
		return

	for (let index = 1; index < 5; index++) {
		const game: Prisma.GameUncheckedCreateInput = {
			type: (index % 2 == 0 ? 'CLASSIC' : 'CUSTOM'),
			status: 'ENDED',
			createdAt: new Date(),
			endedAt: new Date(),
		}
		const scoreRand = Math.random()
		const userGame1: Prisma.UserGameUncheckedCreateInput = {
			gameId: index,
			userId: 1 + Math.floor((users.length) * Math.random()),
			score: scoreRand > 0.5 ? 5 : Math.floor(5 * scoreRand),
			win: scoreRand > 0.5 ? 1 : 0,
			elo: Math.round(400 + 800 * Math.random()),
		}

		let userId2 = userGame1.userId
		while (userId2 === userGame1.userId) {
			userId2 = 1 + Math.floor((users.length) * Math.random())
		}
		const userGame2: Prisma.UserGameUncheckedCreateInput = {
			gameId: index,
			userId: userId2,
			score: scoreRand <= 0.5 ? 5 : Math.floor(5 * scoreRand),
			win: scoreRand <= 0.5 ? 1 : 0,
			elo: Math.round(400 + 800 * Math.random()),
		}
		await prisma.game.create({
			data: game,
		})
		await prisma.userGame.create({
			data: userGame1,
		})
		await prisma.userGame.create({
			data: userGame2,
		})
	}
}

/******************************************************************************/
/***************************** MAIN *******************************************/
/******************************************************************************/
async function main() {
	console.log("Hey seed")
	for (const el of users) {
		await prisma.user.upsert({
			where: { email: el.email },
			update: {},
			create: el,
		})
	}
	for (const [idx, el] of chats.entries()) {
		if (el.password) {
			const saltRounds = 10;
			el.password = await bcrypt.hash(el.password, saltRounds);
		}
		await prisma.chat.upsert({
			where: { id: idx + 1 },
			update: {},
			create: el,
		})
	}
	for (const el of userChats) {
		await prisma.userChat.upsert({
			where: {
				userId_chatId: {
					chatId: el.chatId,
					userId: el.userId,
				}
			},
			update: {},
			create: el,
		})
	}
	for (const [idx, el] of chatMessages.entries()) {
		await prisma.chatMessage.upsert({
			where: { id: idx + 1 },
			update: {},
			create: el,
		})
	}
	await generateGames()
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
