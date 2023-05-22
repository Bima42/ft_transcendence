import { Engine, Bodies, Common, Collision, Body, Composite } from "matter-js";
// import Matter from 'matter-js';
import { Socket, Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { Game, GameStatus } from '@prisma/client';
import { EndGamePlayer, GameoverDto, PlayerMoveDto, PointWonDto, WorldStateDto } from "./dto/game.dto";
import { GameSettingsDto } from "./dto/joinQueueData.dto";
import { toUserDto } from '../shared/mapper/user.mapper';
import { UserDto } from "src/users/dto/user.dto";

// At what pace the simulation is run
const fps = 60;
// At what frequency we send the state to the clients
const syncPerSec = 5;

const maxScore = 5

const timeToStartBeforeAbort = 30000
const disconnectTimeoutDuration = 10000
// Duration of the countdown between the start (ms)
const countdownDuration = 3000

const worldWidth = 800;
const worldHeight = 600;
const wallThickness = 50;
// Yes, the ball is a rectangle (because of Phaser on client size)
const ballSize = { x: 22, y: 22 }
const ballMaxSpeed = 10;
// Distance between the left/right wall to the paddle center
const paddleX = 20;
const paddleSize = { x: 24, y: 104 }
// Round corner on the paddle
const cheaterDetectionLimit = 20;
// The minimum bouncing angle from the paddle
// The ball will go with an angle between x and (180 - x)
const bounceMinAngleDeg = 30;

const obstacles_def = [
	{ x: worldWidth * 2 / 8, y: worldHeight * 2 / 8, color: 'red' },
	{ x: worldWidth * 3 / 8, y: worldHeight * 3 / 8, color: 'yellow' },
	{ x: worldWidth * 5 / 8, y: worldHeight * 5 / 8, color: 'green' },
	{ x: worldWidth * 6 / 8, y: worldHeight * 6 / 8, color: 'blue' },
]

class Obstacle {
	public body: any; // Matter-js body
	public speed = { x: 0, y: 2 };
	private width = 64;
	private height = 32;

	constructor(x: number, y: number) {
		const worldOption = {
			isStatic: true,
		}
		this.body = Bodies.rectangle(x, y, this.width, this.height, worldOption);
	}

	// Move up and down, boucing on the 'walls'
	update() {
		Body.translate(this.body, this.speed)
		if (this.body.position.x < this.width / 2 || this.body.position.x > worldWidth - this.width / 2)
			this.speed.x *= -1;
		if (this.body.position.y < this.height / 2 || this.body.position.y > worldHeight - this.height / 2)
			this.speed.y *= -1;
	}
}

export class GameServer {
	private readonly ball: any;
	private readonly paddle1: any;
	private readonly paddle2: any;
	private IntervalUpdate: NodeJS.Timer;
	private IntervalSync: NodeJS.Timer;
	private disconnectTimeout: NodeJS.Timeout;
	private readonly startTimeout: NodeJS.Timeout;
	private readonly engine!: any;
	private readonly roomID: string;
	private readonly players: EndGamePlayer[] = [];
	private isReady: boolean[] = [false, false]
	private maxScore = maxScore
	private obstacles: Obstacle[] = [];
	private status: GameStatus = "STARTED";
	private hasStarted = false;

	constructor(private server: Server,
		public game: Game,
		players: EndGamePlayer[]) {
		this.roomID = "game" + this.game.id.toString();
		this.players = [];
		this.players.push(players[0])
		this.players.push(players[1])

		// Init MatterJS
		this.engine = Engine.create();
		this.engine.gravity.y = 0;


		this.ball = Bodies.rectangle(worldWidth / 2, worldHeight / 2, ballSize.x, ballSize.y);
		Body.setInertia(this.ball, Infinity);
		this.ball.friction = 0;
		this.ball.frictionAir = 0;
		this.ball.frictionStatic = 0;
		this.ball.restitution = 1;
		Composite.add(this.engine.world, this.ball);

		const worldOption = { isStatic: true };
		this.paddle1 = Bodies.rectangle(paddleX, worldHeight / 2, paddleSize.x, paddleSize.y, worldOption);
		Body.setInertia(this.paddle1, Infinity);
		Composite.add(this.engine.world, this.paddle1);
		this.paddle2 = Bodies.rectangle(worldWidth - paddleX, worldHeight / 2, paddleSize.x, paddleSize.y, worldOption);
		Body.setInertia(this.paddle2, Infinity);
		Composite.add(this.engine.world, this.paddle2);

		// Walls
		Composite.add(this.engine.world, [
			Bodies.rectangle(worldWidth / 2, -wallThickness / 2, worldWidth, wallThickness, worldOption), // upper wall
			Bodies.rectangle(worldWidth / 2, worldHeight + wallThickness / 2, worldWidth, wallThickness, worldOption), // lower wall
			// Bodies.rectangle(-wallThickness/2, worldHeight/2, wallThickness, worldHeight, worldOption), // left wall
			// Bodies.rectangle(worldWidth + wallThickness/2, worldHeight/2, wallThickness, worldHeight, worldOption), // right wall
		])

		if (game.type != "CLASSIC") {

			// Add obstacles
			obstacles_def.forEach((o) => {
				this.obstacles.push(new Obstacle(o.x, o.y))
			})
			this.obstacles.forEach((o) => {
				Composite.add(this.engine.world, o.body)
			})
		}

		// Players have a certain amount of time to start the game
		this.startTimeout = setTimeout(() => { this.onAbortGame("did not start") }, timeToStartBeforeAbort);
	}

	onPlayerMove(socket: Socket, playerMove: PlayerMoveDto) {
		let paddle = (socket.data.user.id === this.players[0].user.id) ? this.paddle1 : this.paddle2

		// Refuse too big movements
		if (playerMove.y - paddle.y > cheaterDetectionLimit) {
			Logger.log("Cheater");
			return;
		}

		Body.setPosition(paddle, { x: paddle.position.x, y: playerMove.y })
		socket.to(this.roomID).except("user" + socket.data.user.id.toString()).emit("enemyMove", playerMove);
	}

	onPlayerDisconnect(socket: Socket) {
		if (!this.hasStarted)
			return;
		Logger.log(`Game#${this.game.id}: ${socket.data.user.username} disconnected`);
		const userIdx = this.players.findIndex(el => socket.data.user.id === el.user.id)
		if (userIdx < 0)
			return

		// check if already disconnected
		if (this.isReady[userIdx]) {
			this.isReady[userIdx] = false;
			this.onPause();
			socket.to(this.roomID).emit("playerDisconnect")
			this.resetLevel();
			if (!this.disconnectTimeout)
				this.disconnectTimeout = setTimeout(() => { this.onAbortGame("player timeout") }, disconnectTimeoutDuration);
		}

		if (!this.isReady[0] && !this.isReady[1] && this.status != 'ENDED')
			this.onAbortGame("both players disconnected");
	}

	onPlayerReconnect(newClient: Socket) {
		if (!this.hasStarted) {
			this.sendStateToClients()
			return;
		}

		Logger.log(`Game#${this.game.id}: ${newClient.data.user.username} reconnected`);
		clearTimeout(this.disconnectTimeout)
		this.disconnectTimeout = null

		// Socket shenanigans
		newClient.join(this.roomID);
		newClient.data.isReady = true;
		newClient.data.gameServer = this;
		this.sendStateToClients();

		this.server.to(this.roomID).emit("playerReconnect", newClient.data.username)

		this.onPause();
		// lauch ball after countdown
		setTimeout(() => {
			Body.setVelocity(this.ball, { x: -ballMaxSpeed, y: 0 });
			this.onResume();
		}, 2000);
	}

	onPlayerIsReady(socket: Socket) {
		Logger.log(`Game#${this.game.id}: ${socket.data.user.username} is ready to play`);

		const userIdx = this.players.findIndex(el => socket.data.user.id === el.user.id)
		if (userIdx < 0)
			return
		this.isReady[userIdx] = true;

		// Check if everybody is ready
		if (!this.hasStarted && this.isReady[0] && this.isReady[1]) {
			clearTimeout(this.startTimeout);
			Logger.log(`Game#${this.game.id}: Starting game !`);
			this.onStartGame();
		}
	}

	private onAbortGame(reason: string) {
		Logger.log(`Game#${this.game.id} aborted: ${reason}`);
		this.status = "ABORTED"

		this.server.to(this.roomID).emit("abortGame", reason)
	}

	private onGameOver() {
		Logger.log(`Game#${this.game.id}: Gameover`);
		this.players[0].userGame.win = this.players[0].userGame.score > this.players[1].userGame.score ? 1 : 0
		this.players[1].userGame.win = this.players[0].userGame.win ? 0 : 1
		const gameoverData: GameoverDto = {
			winnerId: this.players[0].userGame.win ? this.players[0].user.id : this.players[1].user.id,
			score1: this.players[0].userGame.score,
			score2: this.players[1].userGame.score,
		}
		this.server.to(this.roomID).emit("gameover", gameoverData);
		this.status = "ENDED"
	}

	onStartGame() {

		this.hasStarted = true;
		this.onResume();

		// Warn clients that we are about to start
		this.server.to(this.roomID).emit("startGame");

		// lauch ball after countdown
		setTimeout(() => {
			Body.setVelocity(this.ball, { x: -ballMaxSpeed, y: 0 });
		}, countdownDuration);

	}

	private updateScore() {
		// Update score
		if (this.ball.position.x < 0) {
			this.players[1].userGame.score += 1;
		} else {
			this.players[0].userGame.score += 1;
		}
		Logger.log(`Game#${this.game.id}: ${this.players[0].userGame.score} - ${this.players[1].userGame.score}`);

		const pointWon: PointWonDto = {
			score1: this.players[0].userGame.score,
			score2: this.players[1].userGame.score,
		}
		if (this.players[0].userGame.score >= this.maxScore ||
			this.players[1].userGame.score >= this.maxScore) {
			this.onGameOver();
		} else {
			this.server.to(this.roomID).emit("pointEnd", pointWon)
		}
	}

	private resetLevel(): void {

		// Reset ball
		Body.setVelocity(this.ball, { x: 0, y: 0 });
		Body.setPosition(this.ball, { x: worldWidth / 2, y: worldHeight / 2 });

		Body.setPosition(this.paddle1, { x: paddleX, y: worldHeight / 2 });
		Body.setPosition(this.paddle2, { x: worldWidth - paddleX, y: worldHeight / 2 });

		// TODO: Reset Obstacles

	}

	private onPause() {
		this.isPaused = true
		clearInterval(this.IntervalSync);
	}

	private onResume() {
		this.isPaused = false
		this.previousLoopTick = Date.now()
		// Start simulation
		this.updateWorld(1000 / fps);
		this.gameLoop()

		// start syncing with client
		this.sendStateToClients();
		this.IntervalSync = setInterval(() => { this.sendStateToClients(); }, 1000 / syncPerSec);
	}

	/**
	 * This is a hack to avoid the unconsistant behaviour of setInterval
	 * */
	private isPaused = false
	private previousLoopTick: number
	private gameLoop() {
		if (this.isPaused) {
			return
		}
		const now = Date.now()

		if (this.previousLoopTick + (1000 / fps) <= now) {
			const delta = (now - this.previousLoopTick)
			this.previousLoopTick = now
			// This takes time
			this.updateWorld(delta)
		}

		if (Date.now() - this.previousLoopTick < (1000 / fps) - 16) {
			setTimeout(() => this.gameLoop())
		} else {
			setImmediate(() => this.gameLoop())
		}


	}

	private updateWorld(delta: number) {
		// Logger.log(`updateWorld: delta = ${delta}`)

		Engine.update(this.engine, delta);
		this.obstacles.forEach((o) => o.update())

		// Just a fix for some crazy stuff happening
		if (Body.getSpeed(this.ball) > ballMaxSpeed)
			Body.setSpeed(this.ball, ballMaxSpeed);

		if (Collision.collides(this.ball, this.paddle1, null)) {
			this.hitPaddle(this.ball, this.paddle1)
		}
		if (Collision.collides(this.ball, this.paddle2, null)) {
			this.hitPaddle(this.ball, this.paddle2)
		}
		if (this.ball.position.x < -ballSize.x || this.ball.position.x > worldWidth + ballSize.x) {
			this.updateScore();
			this.resetLevel();
			this.onPause()
			if (this.status != "ENDED")
				this.onStartGame();
		}
	}

	private sendStateToClients() {
		const world: WorldStateDto = {
			ball: {
				x: this.ball.position.x,
				y: this.ball.position.y,
				vx: this.ball.velocity.x,
				vy: this.ball.velocity.y,
			},
			paddle1: {
				x: this.paddle1.position.x,
				y: this.paddle1.position.y,
			},
			paddle2: {
				x: this.paddle2.position.x,
				y: this.paddle2.position.y,
			},
			obstacles: [],
		}
		this.obstacles.forEach((o) => world.obstacles.push({
			x: o.body.position.x,
			y: o.body.position.y,
			vx: o.speed.x,
			vy: o.speed.y,
		}))
		this.server.to(this.roomID).emit("state", world)
	}

	private hitPaddle(ball: any, paddle: any) {
		// Don't apply this when already past the paddle
		if ((ball.position.x < worldWidth / 2 && ball.position.x < paddle.position.x)
			|| (ball.position.x > worldWidth / 2 && ball.position.x > paddle.position.x)) {
			return;
		}
		const percentage = Common.clamp((ball.position.y - paddle.position.y + paddleSize.y / 2) / paddleSize.y, 0, 1)
		let newAngle = 180 + bounceMinAngleDeg + (180 - 2 * bounceMinAngleDeg) * percentage;
		// Mirror symmetry for the paddle on the left
		if (ball.position.x < worldWidth / 2)
			newAngle *= -1;
		// convert to radian
		newAngle *= Math.PI / 180;
		Body.setVelocity(this.ball, {
			x: ballMaxSpeed * Math.sin(newAngle),
			y: ballMaxSpeed * Math.cos(newAngle)
		});
	}

	async cleanupGameDataOnSockets() {
		const sockets = await this.server.in("game" + this.roomID).fetchSockets()
		sockets.forEach((s) => {
			// TODO: TEST
			s.data.gameServer = null;
		})
	}

	getStatus(): GameStatus {
		return this.status;
	}

	getUsers(): UserDto[] {
		return [this.players[0].user, this.players[1].user]
	}

	getEndPlayers(): EndGamePlayer[] {
		return this.players
	}

	getScore(): Array<number> {
		return [this.players[0].userGame.score, this.players[1].userGame.score];
	}

	toGameSettingsDto(): GameSettingsDto {
		const users = this.getUsers();
		return {
			game: this.game,
			player1: users[0],
			player2: users[1],
		};
	}
}
