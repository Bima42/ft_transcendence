import Phaser from 'phaser'
import { io, Socket } from "socket.io-client"
import type IGame from '@/interfaces/game/IGame'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore();

class Ball extends Phaser.Physics.Arcade.Image {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'assets', 'ball1')
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true).setBounce(1);
    this.body.maxSpeed = 700;
  }

}

class Paddle extends Phaser.Physics.Arcade.Image {
  body: Phaser.Physics.Arcade.Body;


  constructor(scene: Phaser.Scene, x: number, y: number, nPlayer: number) {
    super(scene, x, y, 'assets', 'paddle' + nPlayer)
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable();
    this.angle = 90;
    this.setSize(this.height, this.width);
    this.body.maxSpeed = 700;
  }

  update() {

  }

}

class Obstacle extends Phaser.Physics.Arcade.Image {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number, color: string) {
    super(scene, x, y, 'assets', color + '1')
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.maxSpeed = 200;
    this.setImmovable().setVelocityY(this.body.maxSpeed).setCollideWorldBounds(true).setBounce(1)
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
  private socket: Socket;

  constructor(mode: string = "custom") {
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

  private updateWorld(obj: WorldState) {
    this.paddle1.y = obj.paddle1;
    this.paddle2.y = obj.paddle2;
    this.ball.x = obj.ball.x;
    this.ball.y = obj.ball.y;
    this.ball.setVelocity(obj.ball.vx, obj.ball.vy);
  }

  create(config: IGame): void {
    this.parseConfig(config);

    this.socket = gameStore.socket;
    this.socket.on("state", (msg: string) => {
      try {
        const obj = JSON.parse(msg);
        this.updateWorld(obj);
      } catch (error) {
        // Drop malformed request from server
      }
    });

    this.parseConfig(config);
    if (this.config.classic) {
      console.log("Classic game.");
    } else {
      console.log("Custom game !");
    }


    //  Enable world bounds, but disable the sides (left, right, up, down)
    this.physics.world.setBoundsCollision(false, false, true, true);

    this.ball = new Ball(this, 400, 300);
    this.ball.setData('uponStart', true);

    this.paddle1 = new Paddle(this, 20, 300, 1);
    this.paddle2 = new Paddle(this, 780, 300, 2);
    this.physics.add.collider(this.ball, this.paddle1, this.hitPaddle, undefined, this);
    this.physics.add.collider(this.ball, this.paddle2, this.hitPaddle, undefined, this);

    this.scoreText = this.add.text(0, 50, "0 - 0", { fontFamily: 'Arial', fontSize: "50px", color: "#00FF00" });
    this.scores = [0, 0];

    if (!this.config.classic) {
      this.obstacles[0] = new Obstacle(this, 200, 300, 'red');;
      this.obstacles[1] = new Obstacle(this, 300, 200, 'yellow');
      this.obstacles[2] = new Obstacle(this, 600, 500, 'blue');
      this.obstacles[3] = new Obstacle(this, 500, 100, 'green');

      this.obstacles.forEach((obstacle) => {
        this.physics.add.collider(this.ball, obstacle, this.hitObstacle, null, this);
      });
    }

    //  Input events
    this.keys = this.input.keyboard.addKeys('s,w,i,k');

    this.input.on('pointerup', function(pointer) {
      if (this.ball.getData('uponStart')) {
        this.ball.setVelocity(-700, 0);
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
    if (this.scores[0] >= this.maxScore || this.scores[1] >= this.maxScore) {
      this.scene.start("GameoverScene");
    }

    this.resetBall();
  }

  hitObstacle(ball: Ball, obstacle: Obstacle) {
    // // Make sure that the ball keeps the same speed;
    ball.body.speed = ball.maxSpeed;
    // // Make sure that the obstacle keeps the same speed;
    obstacle.body.speed = obstacle.maxSpeed;

    this.sound.play('thud', { volume: 0.75 })
  }

  hitPaddle(ball, paddle) {
    const minAngle = 30;
    const percentage = Phaser.Math.Clamp((ball.y - paddle.y + paddle.width / 2) / paddle.width, 0, 1)
    var newAngle = 180 + minAngle + (180 - 2 * minAngle) * percentage;
    // Mirror translation for the paddle on the left
    if (ball.x < 300)
      newAngle *= -1;
    // convert to radian
    newAngle *= Math.PI / 180;
    ball.setVelocity(ball.body.maxSpeed * Math.sin(newAngle), ball.body.maxSpeed * Math.cos(newAngle));

    this.sound.play('thud', { volume: 0.75 })
  }

  update() {
    this.scoreText.setText(this.scores[0] + " - " + this.scores[1]);
    Phaser.Display.Align.In.Center(this.scoreText, this.add.zone(400, 30, 800, 400));

    if (this.ball.x < 0 || this.ball.x > 800) {
      this.resetLevel();
    }

    this.paddle1.setVelocity(0);
    if (this.keys.s.isDown) {
      this.paddle1.setVelocityY(this.paddle1.body.maxSpeed);
      this.socket.emit("move", JSON.stringify({
        paddle: 1,
        y: this.paddle1.y,
      }));
    }
    if (this.keys.w.isDown) {
      this.paddle1.setVelocityY(-this.paddle1.body.maxSpeed);
      this.socket.emit("move", JSON.stringify({
        paddle: 1,
        y: this.paddle1.y,
      }));
    }
    this.paddle1.y = Phaser.Math.Clamp(this.paddle1.y, 0, 600);

    this.paddle2.setVelocity(0);
    if (this.keys.i.isDown) { this.paddle2.setVelocityY(-this.paddle2.body.maxSpeed); }
    if (this.keys.k.isDown) { this.paddle2.setVelocityY(this.paddle2.body.maxSpeed); }
    this.paddle2.y = Phaser.Math.Clamp(this.paddle2.y, 0, 600);
  }

};
