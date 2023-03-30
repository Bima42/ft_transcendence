import Phaser from 'phaser'
import { Socket } from "socket.io-client"
import type IUser from '@/interfaces/user/IUser'
import type GameType from '@/interfaces/game/IGame'
import type IGameSettings from '@/interfaces/game/IGameSettings'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import type UiScene from './UiScene'
import type { IPointWon } from '@/interfaces/game/IGameCommunication'

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

  public maxSpeed = 10;

  constructor(scene: Phaser.Scene, x: number, y: number, nPlayer: number) {
    super(scene.matter.world, x, y, 'assets', 'paddle' + nPlayer, {isStatic: true,chamfer: { radius: 15 }})
    scene.add.existing(this);
    scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity)
    this.setFixedRotation();
    this.setRotation(Math.PI / 2);
    this.setSize(this.height, this.width);
  }
}

class Obstacle extends Phaser.Physics.Matter.Image {

  private maxSpeed = 2;
  private dir = -1;

  constructor(scene: Phaser.Scene, x: number, y: number, color: string) {
    super(scene.matter.world, x, y, 'assets', color + '1')
    scene.add.existing(this);
    scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity)
    this.setBounce(1);
    this.setStatic(true);
    this.setFriction(0);
  }

  update () {
    this.y += this.dir * this.maxSpeed;
    if (this.y < 15 || this.y > 585)
      this.dir *= -1;
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
    y: number
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
  private canMove: boolean = false;
  private uiScene!: UiScene;
  private enemyPos: number | null = null;
  private worldState: WorldState | null = null;


  constructor() {
    super({ key: 'PongScene' })
  }

  preload() {

  }

  private parseConfig(config: IGameSettings) {

    if (!config) {
      console.warn('no game settings provided');
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
      i++
    })
  }

  private updateEnemy(y: number) {
      if (!this.otherPaddle){
        return
      }
      this.enemyPos = y;
  }

  create(config: IGameSettings): void {
    this.parseConfig(gameStore.currentGame);

    this.socket = gameStore.socket as Socket;
    this.socket.on("state", (state: WorldState) => {
      this.worldState = state;
    });

    this.socket.on("enemyMove", (msg: any) => {
      // console.log("enemyMove: " + JSON.stringify(msg));
      this.updateEnemy(msg.y ?? 0)
    });

    this.socket.on("startGame", () => {
      this.startGame()
      this.uiScene.startGame();
    });

    this.socket.on("playerDisconnect", () => {
      console.log("playerDisconnect"),
      this.uiScene.onPlayerDisconnect()
      this.scene.pause()
    });

    this.socket.on("pointEnd", (score: IPointWon) => {
        console.log("Point finished");
        this.uiScene.onPointEnd(score);
        this.resetLevel();
    });

    this.socket.on("gameover", (score: IPointWon) => {
      console.log("Game over");
      this.uiScene.onGameover(score);
      this.scene.stop('UiScene');
      this.scene.start("GameoverScene");
    });

    //  Enable world bounds, but disable the sides (left, right, up, down)
    this.matter.world.setBounds(0, 0, 800, 600, 32, false, false, true, true);
    // this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, true, true);

    this.ball = new Ball(this, 400, 300);
    this.ball.setOnCollide(() => this.sound.play('thud', { volume: 0.15 }))

    this.paddle1 = new Paddle(this, 20, 300, 1);
    this.paddle2 = new Paddle(this, 780, 300, 2);
    this.ball.setOnCollideWith(this.paddle1, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitPaddle(data));
    this.ball.setOnCollideWith(this.paddle2, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitPaddle(data));

    if ( this.config.type != 'CLASSIC') {
      this.obstacles[0] = new Obstacle(this, 200, 300, 'red');
      this.obstacles[1] = new Obstacle(this, 300, 200, 'yellow');
      this.obstacles[3] = new Obstacle(this, 500, 100, 'green');
      this.obstacles[2] = new Obstacle(this, 600, 500, 'blue');

      // this.obstacles.forEach((obstacle) => {
      //   this.ball.setOnCollideWith(obstacle, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitObstacle(data));
      // });
      //
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

  }

  private resetLevel(): void {
    this.ball.setVelocity(0);
    this.ball.setPosition(400, 300);

    // TODO: Reset paddles

    // TODO: Reset obstacles
  }

  // Before Countdown: not a lot to do in the game part
  private startGame() {
    console.log("start game !");
    this.canMove = true;
  }

  hitObstacle( data: Phaser.Types.Physics.Matter.MatterCollisionData) {
    // let ball = data.bodyA.gameObject as Ball;
    // let obstacle = data.bodyB.gameObject as Obstacle;

    // // // Make sure that the ball keeps the same speed;
    // ball.body.speed = ball.maxSpeed;
    // // // Make sure that the obstacle keeps the same speed;
    // obstacle.body.speed = obstacle.maxSpeed;

  }

    hitPaddle( data: Phaser.Types.Physics.Matter.MatterCollisionData) {
      let ball = data.bodyA.gameObject as Ball;
      let paddle = data.bodyB.gameObject as Paddle;
      const minAngle = 30;
      const percentage = Phaser.Math.Clamp((ball.y - paddle.y + paddle.height / 2) / paddle.height, 0, 1)
      var newAngle = 180 + minAngle + (180 - 2 * minAngle) * percentage;
      // Mirror translation for the paddle on the left
      if (ball.x < 300)
        newAngle *= -1;
      // convert to radian
      newAngle *= Math.PI / 180;
      ball.setVelocity(ball.maxSpeed * Math.sin(newAngle), ball.maxSpeed * Math.cos(newAngle));
  }

  handleInput() {
    if (!this.canMove)
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
      this.myPaddle.y = Phaser.Math.Clamp(this.myPaddle.y, 0, 600);
      this.socket.emit("move", { y: this.myPaddle.y });
    }
  }

  update() {

    this.handleInput();

    if (this.enemyPos) {
      this.otherPaddle.y = this.enemyPos;
      this.enemyPos = null;
    }
    if (this.worldState) {
      this.updateWorld(this.worldState)
      this.worldState = null;
    } else {
    if (this.canMove)
      this.obstacles.forEach((o) => o.update());
    }
  }


};
