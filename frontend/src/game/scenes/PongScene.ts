import Phaser from 'phaser'
import { Socket } from "socket.io-client"
import type IUser from '@/interfaces/user/IUser'
import type GameType from '@/interfaces/game/IGame'
import type IGameSettings from '@/interfaces/game/IGameSettings'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import type UiScene from './UiScene'
import type { IPointWon } from '@/interfaces/game/IGameCommunication'
import { get } from '../../../utils'
import * as pong from "../GameConsts"


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

  private initPos: {x: number, y: number}
  public maxSpeed = 10;

  constructor(scene: Phaser.Scene, x: number, y: number, nPlayer: number) {
    super(scene.matter.world, x, y, 'assets', 'paddle' + nPlayer, { isStatic: true })
    scene.add.existing(this);
    scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity)
    this.setFixedRotation();
    this.setRotation(Math.PI / 2);
    this.setSize(this.height, this.width);
    this.initPos = {x: x, y:y}
  }

  reset() {
    this.x = this.initPos.x;
    this.y = this.initPos.y;
  }
}

class Obstacle extends Phaser.Physics.Matter.Image {

  public speed = {x: 0, y: 2};

  constructor(scene: Phaser.Scene, x: number, y: number, color: string) {
    super(scene.matter.world, x, y, 'assets', color + '1')
    scene.add.existing(this);
    scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity)
    this.setBounce(1);
    this.setStatic(true);
    this.setFriction(0);
  }

  update () {
    this.x += this.speed.x;
    this.y += this.speed.y;
    if (this.x < this.width / 2 || this.y > pong.worldWidth - this.width / 2)
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

class GameSettings {
  public maxScore: number = 3
  public type: GameType = 'CLASSIC'
  public player1!: IUser
  public player2!: IUser
}

export default class PongScene extends Phaser.Scene {

  private config = new GameSettings();
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


  constructor() {
    super({ key: 'PongScene' })
  }

  preload() {

  }

  private parseConfig(config: IGameSettings | null) {

    if (!config) {
      this.config.maxScore = 3;
      this.config.type = 'CLASSIC';
      return;
    }
    this.config = new GameSettings();
    this.config.type = config.game.type;
    this.config.player1 = config.player1;
    this.config.player2 = config.player1;
    this.config.maxScore = 3;

    const gameNumber = config ? config.game.id : 0
    if (this.config.type == 'CLASSIC') {
      console.log(`Game #${gameNumber}: Classic game.`);
    } else {
      console.log(`Game #${gameNumber}: Custom game.`);
    }
  }

  private updateWorld(state: WorldState) {
    this.paddle1.x = state.paddle1.x;
    this.paddle1.y = state.paddle1.y;
    this.paddle2.x = state.paddle2.x;
    this.paddle2.y = state.paddle2.y;
    this.ball.x = state.ball.x;
    this.ball.y = state.ball.y;
    this.ball.setVelocity(state.ball.vx, state.ball.vy);
    let i = 0;
    state.obstacles.forEach((o) => {
      this.obstacles[i].x = o.x;
      this.obstacles[i].y = o.y;
      this.obstacles[i].speed.x = o.vx;
      this.obstacles[i].speed.y = o.vy;
      i++
    })
  }

  async create() {
    this.socket = gameStore.socket as Socket;
    resetSocketGameListener(this.socket);

    // Get the current game from the server and put it into the store
    await get('game/current', "Cannot get game config")
      .then(answer => answer.json())
      .then((gameSettings : IGameSettings) => {
        gameStore.currentGame = gameSettings;
        this.parseConfig(gameSettings)
      })
      .catch ((e: Error) => { console.error(e) })

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

    this.socket.on("playerReconnect", () => {
      this.uiScene.onPlayerReconnect()
      this.isRunning = false;
      this.scene.pause(this)
      setTimeout(() => {
        this.isRunning = true;
        this.scene.resume(this)
      }, pong.ReconnectBreakMs);
    });

    this.socket.on("abortGame", () => {
      resetSocketGameListener(this.socket);
      this.uiScene.onAbortGame()
      this.scene.pause(this)
    });

    this.socket.on("pointEnd", (score: IPointWon) => {
        this.uiScene.onPointEnd(score);
        this.resetLevel();
    });

    this.socket.on("gameover", (score: IPointWon) => {
      resetSocketGameListener(this.socket);
      this.uiScene.onGameover(score);
      this.scene.stop('UiScene');
      this.scene.start("GameoverScene");
    });

    // Send disconnect message when destroying the game
    this.events.on('destroy', () => {
      this.socket.emit("playerDisconnect");
      resetSocketGameListener(this.socket);
    })


    //  Enable world bounds, but disable the sides (left, right, up, down)
    this.matter.world.setBounds(0, 0, pong.worldWidth, pong.worldHeight, 32, false, false, true, true);

    this.ball = new Ball(this, pong.worldWidth / 2, pong.worldHeight / 2);
    this.ball.setOnCollide(() => this.sound.play('thud', { volume: 0.15 }))

    this.paddle1 = new Paddle(this, pong.paddleX, pong.worldHeight / 2, 1);
    this.paddle2 = new Paddle(this, pong.worldWidth - pong.paddleX, pong.worldHeight / 2, 2);
    this.ball.setOnCollideWith(this.paddle1, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitPaddle(data));
    this.ball.setOnCollideWith(this.paddle2, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitPaddle(data));

    if ( this.config.type != 'CLASSIC') {
      this.obstacles[0] = new Obstacle(this, pong.worldWidth * 2 / 8, pong.worldHeight * 2 / 8, 'red');
      this.obstacles[1] = new Obstacle(this, pong.worldWidth * 3 / 8, pong.worldHeight * 3 / 8, 'yellow');
      this.obstacles[3] = new Obstacle(this, pong.worldWidth * 5 / 8, pong.worldHeight * 5 / 8, 'green');
      this.obstacles[2] = new Obstacle(this, pong.worldWidth * 6 / 8, pong.worldHeight * 6 / 8, 'blue');
    }

    //  Input events
    this.keys = this.input.keyboard.addKeys('s,w');

    this.myPaddle = this.paddle1;
    this.otherPaddle = this.paddle2;
    // If it is the second player
    if (this.config.player2 && this.config.player2.id == userStore.user?.id){
      // rotate the screen
      this.cameras.main.setRotation(Math.PI);
      // inverse paddles
      this.myPaddle = this.paddle2;
      this.otherPaddle = this.paddle1;
      // inverse control
      this.myPaddle.maxSpeed *= -1;
    }

    this.uiScene = this.scene.get("UiScene") as UiScene;
    setTimeout(() => {
      gameStore.socket.emit("reconnect")
    }, 500)

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

  hitObstacle( _data: Phaser.Types.Physics.Matter.MatterCollisionData) {
    // let ball = data.bodyA.gameObject as Ball;
    // let obstacle = data.bodyB.gameObject as Obstacle;
    //
    // // Make sure that the ball keeps the same speed;
    // ball.body.speed = ball.maxSpeed;
    // // Make sure that the obstacle keeps the same speed;
    // obstacle.body.speed = obstacle.maxSpeed;
  }

    hitPaddle( data: Phaser.Types.Physics.Matter.MatterCollisionData) {
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
      return ;

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
};

function resetSocketGameListener(socket: Socket) {
  socket.removeAllListeners("state");
  socket.removeAllListeners("enemyMove");
  socket.removeAllListeners("startGame");
  socket.removeAllListeners("playerDisconnect");
  socket.removeAllListeners("playerReconnect");
  socket.removeAllListeners("abortGame");
  socket.removeAllListeners("pointEnd");
  socket.removeAllListeners("gameover");
}
