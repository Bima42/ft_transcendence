import Phaser from 'phaser'
import { Socket } from "socket.io-client"
import type IGame from '@/interfaces/game/IGame'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore();

class Ball extends Phaser.Physics.Matter.Image {

  public maxSpeed = 15;

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
    this.setVelocity(0, 2);
  }

  update () {
    this.y += this.dir * this.maxSpeed;
    if (this.y < 15 || this.y > 585)
      this.dir *= -1;
  }

}

class GameSettings {
  classic: boolean = true;
  maxScore: number = 3;
}

type WorldState = {
  ball: {
    x: number,
    y: number,
    vx: number,
    vy: number,
  }
  paddle1: number
  paddle2: number
  obstacles: {
    x: number,
    y: number
  }[]
}

export default class PongScene extends Phaser.Scene {

  private config: GameSettings;
  private ball!: Ball;
  private paddle1!: Paddle;
  private paddle2!: Paddle;
  private keys: any;
  private scores: Array<number> = [0, 0];
  private scoreText: any;
  private obstacles: Obstacle[] = [];
  private socket!: Socket;

  constructor() {
    super({ key: 'PongScene' })
    this.config = new GameSettings();
  }

  preload() {

  }

  private parseConfig(config: IGame) {

    if (!config) {
      this.config.maxScore = 3;
      this.config.classic = true;
      return;
    }
    this.config.maxScore = 3;
    this.config.classic = config.classic ?? true;
  }

  private updateWorld(state: WorldState) {
    this.paddle1.y = state.paddle1;
    this.paddle2.y = state.paddle2;
    this.ball.x = state.ball.x;
    this.ball.y = state.ball.y;
    this.ball.setVelocity(state.ball.vx, state.ball.vy);
    let i = 0;
    state.obstacles.forEach((o) => {
      this.obstacles[i].x = o.x;
      i = i + 1;
    })
  }

  create(config: IGame): void {
    this.parseConfig(config);

    this.socket = gameStore.socket as Socket;
    this.socket.on("state", (state: WorldState) => {
        this.updateWorld(state);
      }
    );

    this.socket.on("enemyMove", (msg: any) => {
      const y = msg.y || 0;
      console.log(`enemy moved at position: ${y}`)
      this.paddle2.y = msg.y;
    });

    this.parseConfig(config);
    if (this.config.classic) {
      console.log("Classic game.");
    } else {
      console.log("Custom game !");
    }

    //  Enable world bounds, but disable the sides (left, right, up, down)
    this.matter.world.setBounds(0, 0, 800, 600, 32, false, false, true, true);

    this.ball = new Ball(this, 400, 300);
    this.ball.setData('uponStart', true);
    this.ball.setOnCollide(() => this.sound.play('thud', { volume: 0.15 }))

    this.paddle1 = new Paddle(this, 20, 300, 1);
    this.paddle2 = new Paddle(this, 780, 300, 2);
    this.ball.setOnCollideWith(this.paddle1, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitPaddle(data));
    this.ball.setOnCollideWith(this.paddle2, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitPaddle(data));

    this.scoreText = this.add.text(0, 50, "0 - 0", { fontFamily: 'Arial', fontSize: "50px", color: "#00FF00" });
    this.scores = [0, 0];

    if (this.config.classic) {
      this.obstacles[0] = new Obstacle(this, 200, 300, 'red');
      this.obstacles[1] = new Obstacle(this, 300, 200, 'yellow');
      this.obstacles[2] = new Obstacle(this, 600, 500, 'blue');
      this.obstacles[3] = new Obstacle(this, 500, 100, 'green');

      // this.obstacles.forEach((obstacle) => {
      //   this.ball.setOnCollideWith(obstacle, (_: any, data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.hitObstacle(data));
      // });
    }

    //  Input events
    this.keys = this.input.keyboard.addKeys('s,w');

    this.input.on('pointerup', (_pointer: any) => {
      if (this.ball.getData('uponStart')) {
        this.ball.setVelocity(-this.ball.maxSpeed, 0);
        this.ball.setData('uponStart', false);
      }
    }, this);
  }

  private resetBall() {
    this.ball.setVelocity(0);
    this.ball.setPosition(400, 300);
    this.ball.setData('uponStart', true);
  }

  private resetLevel(): void {
    if (this.ball.x < 0) {
      this.scores[1] += 1;
    } else {
      this.scores[0] += 1;
    }
    if (this.scores[0] >= this.config.maxScore || this.scores[1] >= this.config.maxScore) {
      this.scene.start("GameoverScene");
    }

    this.resetBall();
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
  //
  }

  update() {
    this.scoreText.setText(this.scores[0] + " - " + this.scores[1]);
    Phaser.Display.Align.In.Center(this.scoreText, this.add.zone(400, 30, 800, 400));

    if (this.ball.x < 0 || this.ball.x > 800) {
      this.resetLevel();
    }

    this.paddle1.setVelocity(0);
    if (this.keys.s.isDown) {
      this.paddle1.y += this.paddle1.maxSpeed;
      this.socket.emit("move", { y: this.paddle1.y });
    }
    if (this.keys.w.isDown) {
      this.paddle1.y -= this.paddle1.maxSpeed;
      this.socket.emit("move", { y: this.paddle1.y });
    }
    this.paddle1.y = Phaser.Math.Clamp(this.paddle1.y, 0, 600);

    this.obstacles.forEach((o) => o.update());
  }


};
