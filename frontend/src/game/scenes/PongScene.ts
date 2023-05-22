import Phaser from 'phaser'
import type { Socket } from "socket.io-client"
import type IGameSettings from '@/interfaces/game/IGameSettings'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import type UiScene from './UiScene'
import type { IGameoverData, IPointWon } from '@/interfaces/game/IGameCommunication'
import * as pong from "../GameConsts"
import type { Router } from 'vue-router'


const gameStore = useGameStore();
const userStore = useUserStore();

class Ball extends Phaser.Physics.Matter.Image {

	public maxSpeed = 10;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene.matter.world, x, y, 'assets', 'ball1')
		scene.add.existing(this);
		scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity)
		this.setFriction(0, 0, 0);
		this.setBounce(1);
	}

}

class Paddle extends Phaser.Physics.Matter.Image {

	private initPos: { x: number, y: number }
	public maxSpeed = 10;

	constructor(scene: Phaser.Scene, x: number, y: number, nPlayer: number) {
		super(scene.matter.world, x, y, 'assets', 'paddle' + nPlayer, { isStatic: true })
		scene.add.existing(this);
		scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity)
		this.setFixedRotation();
		this.setRotation(Math.PI / 2);
		this.setSize(this.height, this.width);
		this.initPos = { x: x, y: y }
	}

	reset() {
		this.x = this.initPos.x;
		this.y = this.initPos.y;
	}
}

class Obstacle extends Phaser.Physics.Matter.Image {

	public speed = { x: 0, y: 2 };

	constructor(scene: Phaser.Scene, x: number, y: number, color: string) {
		super(scene.matter.world, x, y, 'assets', color + '1')
		scene.add.existing(this);
		scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity)
		this.setBounce(1);
		this.setStatic(true);
		this.setFriction(0);
	}

	update() {
		this.x += this.speed.x;
		this.y += this.speed.y;
		if (this.x < this.width / 2 || this.x > pong.worldWidth - this.width / 2)
			this.speed.x *= -1;
		if (this.y < this.height / 2 || this.y > pong.worldHeight - this.height / 2)
			this.speed.y *= -1;
	}

}

type WorldState = {
	ball: {
		x: number,
		y: number,
		vx: number,
		vy: number,
	}
	paddle1: {
		x: number,
		y: number,
	}
	paddle2: {
		x: number,
		y: number,
	}
	obstacles: {
		x: number,
		y: number,
		vx: number,
		vy: number,
	}[]
}

export default class PongScene extends Phaser.Scene {

	private config!: IGameSettings;
	private ball!: Ball;
	private paddle1!: Paddle;
	private paddle2!: Paddle;
	private myPaddle!: Paddle;
	private otherPaddle!: Paddle;
	private keys: any;
	public scores: Array<number> = [0, 0];
	private obstacles: Obstacle[] = [];
	private socket!: Socket;
	private isRunning: boolean = false;
	private uiScene!: UiScene;
	private vueRouter!: Router;
	private middleLine!: Phaser.Geom.Line
	private graphics!: any


	constructor() {
		super({ key: 'PongScene' })
	}

	preload() {

	}

	private updateEntityPosition(object: any, servRef: any, name: string, maxDiff: number = 10) {
		const diff = {
			x: object.x - servRef.x,
			y: object.y - servRef.y,
		}
		const totalDiff = diff.x * diff.x + diff.y * diff.y
		if (totalDiff > maxDiff * maxDiff) {
			object.x = servRef.x
			object.y = servRef.y
		}
	}

	private updateWorld(state: WorldState) {
		this.updateEntityPosition(this.paddle1, state.paddle1, "paddle1", 3)
		this.updateEntityPosition(this.paddle2, state.paddle2, "paddle2", 3)
		this.updateEntityPosition(this.ball, state.ball, "ball", 10)
		this.ball.setVelocity(state.ball.vx, state.ball.vy);
		let i = 0;
		state.obstacles.forEach((o) => {
			this.updateEntityPosition(this.obstacles[i], o, `obstacle${i}`, 3)
			this.obstacles[i].speed.x = o.vx;
			this.obstacles[i].speed.y = o.vy;
			i++
		})
	}

	create(router: Router) {
		this.vueRouter = router
		if (!gameStore.currentGame) {
			return
		}
		this.config = gameStore.currentGame
		this.socket = gameStore.socket as Socket;
		this.resetSocketGameListener();

		if (!this.config.game)
			return;

		// Now that we have the config, we can launch the UI
		this.uiScene = this.scene.get("UiScene") as UiScene;

		//  Enable world bounds, but disable the sides (left, right, up, down)
		this.matter.world.setBounds(0, 0, pong.worldWidth, pong.worldHeight, 32, false, false, true, true);

		// Middle lane
		this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x808080 } });
		this.middleLine = new Phaser.Geom.Line(pong.worldWidth / 2, 0, pong.worldWidth / 2, pong.worldHeight);
		this.graphics.strokeLineShape(this.middleLine);

		this.ball = new Ball(this, pong.worldWidth / 2, pong.worldHeight / 2);
		this.ball.setOnCollide(() => this.sound.play('thud', { volume: 0.15 }))

		this.paddle1 = new Paddle(this, pong.paddleX, pong.worldHeight / 2, 1);
		this.paddle2 = new Paddle(this, pong.worldWidth - pong.paddleX, pong.worldHeight / 2, 2);
		this.ball.setOnCollideWith(this.paddle1, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitPaddle(data));
		this.ball.setOnCollideWith(this.paddle2, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitPaddle(data));

		if (this.config.game?.type != 'CLASSIC') {
			this.obstacles[0] = new Obstacle(this, pong.worldWidth * 2 / 8, pong.worldHeight * 2 / 8, 'red');
			this.obstacles[1] = new Obstacle(this, pong.worldWidth * 3 / 8, pong.worldHeight * 3 / 8, 'yellow');
			this.obstacles[3] = new Obstacle(this, pong.worldWidth * 5 / 8, pong.worldHeight * 5 / 8, 'green');
			this.obstacles[2] = new Obstacle(this, pong.worldWidth * 6 / 8, pong.worldHeight * 6 / 8, 'blue');
		}

		//  Input events
		this.keys = this.input.keyboard.addKeys('s,w');
		this.input.mouse.disableContextMenu();

		this.myPaddle = this.paddle1;
		this.otherPaddle = this.paddle2;
		// If it is the second player
		if (this.config.player2 && this.config.player2.id == userStore.user?.id) {
			// rotate the screen
			this.cameras.main.setRotation(Math.PI);
			// inverse paddles
			this.myPaddle = this.paddle2;
			this.otherPaddle = this.paddle1;
			// inverse control
			this.myPaddle.maxSpeed *= -1;
		}

		// Send disconnect message when destroying the game
		this.events.on('destroy', () => {
			this.clearSocketGameListener();
			this.socket.emit("playerDisconnect");
		})

		// Now that we are setup, send to the server that we are ready
		setTimeout(() => { gameStore.socket.emit("reconnect") }, 500)

	}

	private resetLevel(): void {
		this.ball.setVelocity(0);
		this.ball.setPosition(pong.worldWidth / 2, pong.worldHeight / 2);

		this.paddle1.reset()
		this.paddle2.reset()

		// TODO: Reset obstacles
	}

	// Before Countdown: not a lot to do in the game part
	private startGame() {
		this.isRunning = true;
	}

	hitObstacle(_data: Phaser.Types.Physics.Matter.MatterCollisionData) {
		// let ball = data.bodyA.gameObject as Ball;
		// let obstacle = data.bodyB.gameObject as Obstacle;
		//
		// // Make sure that the ball keeps the same speed;
		// ball.body.speed = ball.maxSpeed;
		// // Make sure that the obstacle keeps the same speed;
		// obstacle.body.speed = obstacle.maxSpeed;
	}

	hitPaddle(data: Phaser.Types.Physics.Matter.MatterCollisionData) {
		let ball = data.bodyA.gameObject as Ball;
		let paddle = data.bodyB.gameObject as Paddle;
		const percentage = Phaser.Math.Clamp((ball.y - paddle.y + paddle.height / 2) / paddle.height, 0, 1)
		var newAngle = 180 + pong.bounceMinAngleDeg + (180 - 2 * pong.bounceMinAngleDeg) * percentage;
		// Mirror translation for the paddle on the left
		if (ball.x < pong.worldWidth / 2)
			newAngle *= -1;
		newAngle = Phaser.Math.DegToRad(newAngle)
		ball.setVelocity(ball.maxSpeed * Math.sin(newAngle), ball.maxSpeed * Math.cos(newAngle));
	}

	handleInput() {
		if (!this.isRunning)
			return;

		let moved = false;
		if (this.keys.s.isDown) {
			this.myPaddle.y += this.myPaddle.maxSpeed;
			moved = true;
		}
		if (this.keys.w.isDown) {
			this.myPaddle.y -= this.myPaddle.maxSpeed;
			moved = true;
		}
		if (moved) {
			this.myPaddle.y = Phaser.Math.Clamp(this.myPaddle.y, 0, pong.worldHeight);
			this.socket.emit("move", { y: this.myPaddle.y });
		}
	}

	update() {
		this.handleInput();

		if (this.isRunning)
			this.obstacles.forEach((o) => o.update());

	}

	private clearSocketGameListener() {
		this.socket.removeAllListeners("state");
		this.socket.removeAllListeners("enemyMove");
		this.socket.removeAllListeners("startGame");
		this.socket.removeAllListeners("playerDisconnect");
		this.socket.removeAllListeners("playerReconnect");
		this.socket.removeAllListeners("abortGame");
		this.socket.removeAllListeners("pointEnd");
		this.socket.removeAllListeners("gameover");
	}

	private resetSocketGameListener() {
		this.clearSocketGameListener();

		this.socket.on("state", (state: WorldState) => {
			this.updateWorld(state);
		});

		this.socket.on("enemyMove", (msg: any) => {
			this.otherPaddle.y = msg.y ?? 0;
		});

		this.socket.on("startGame", () => {
			this.startGame()
			this.uiScene.startGame();
		});

		this.socket.on("playerDisconnect", () => {
			this.uiScene.onPlayerDisconnect()
			this.scene.pause(this)
			this.resetLevel();
		});

		this.socket.on("playerReconnect", (username: string) => {
			this.resetSocketGameListener()
			this.uiScene.onPlayerReconnect(username)
			this.isRunning = false;
			this.scene.pause(this)
			setTimeout(() => {
				this.isRunning = true;
				this.scene.resume(this)
			}, pong.ReconnectBreakMs);
		});

		this.socket.on("abortGame", (reason: string) => {
			this.clearSocketGameListener()
			this.uiScene.onAbortGame(reason)
			this.scene.pause(this)
		});

		this.socket.on("pointEnd", (score: IPointWon) => {
			this.uiScene.onPointEnd(score);
			this.resetLevel();
		});

		this.socket.on("gameover", (gameoverData: IGameoverData) => {
			this.uiScene.onGameover(gameoverData);
			this.clearSocketGameListener()
			this.scene.stop('UiScene');
			this.scene.start("GameoverScene", { data: gameoverData, router: this.vueRouter });
		});
	}
};
