
import { Socket, Server } from "socket.io";

type PlayerMoveDto = {
  y: number
}

class GameSettings {
  classic?: boolean;
  maxScore?: number = 3;
  server: Server;
  player1?: Socket;
  player2?: Socket;
}

export class GameServer {
  private ball: {
    x: number,
    y: number,
    vx: number,
    vy: number,
  }
  private paddle1: number;
  private paddle2: number;
  private server: Server;
  private clients: Socket[];
  private cancelInterval;

  constructor(config: GameSettings) {
    this.ball = {x: 0, y: 0, vx: 0, vy: 0};
    this.server = config.server;

    this.cancelInterval = setInterval(() => this.update(), 1000);

  }

  // onPlayerMove(_playerMove: PlayerMoveDto) {
  onPlayerMove(socket: Socket) {
    console.log(`PlayerMove from ${socket.data.user.username}`);
  }

  onPlayerDisconnect() {

  }


  update() {
    console.log("Game update " + this.ball.x);
    this.ball.x++
  }


};


////////////////////////////////////////////////////////////////////////////////

// class Ball extends Phaser.Physics.Arcade.Image {
//   body: Phaser.Physics.Arcade.Body;
//
// 	constructor(scene: Phaser.Scene, x: number, y: number) {
// 		super(scene, x, y, 'assets', 'ball1')
// 		scene.add.existing(this);
// 		scene.physics.add.existing(this);
// 		this.setCollideWorldBounds(true).setBounce(1);
// 		this.body.maxSpeed = 700;
// 	}
// }
//
// class Paddle extends Phaser.Physics.Arcade.Image {
//   body: Phaser.Physics.Arcade.Body;
//
//
// 	constructor(scene: Phaser.Scene, x: number, y: number, nPlayer: number) {
// 		super(scene, x, y, 'assets', 'paddle' + nPlayer)
// 		scene.add.existing(this);
// 		scene.physics.add.existing(this);
// 		this.setImmovable();
//         this.angle = 90;
// 		this.setSize(this.height, this.width);
// 		this.body.maxSpeed = 700;
// 	}
// }
//
// class GameSettings {
//   classic: boolean;
//   maxScore: number = 3;
//   socket: Server;
// }
//
// class WorldState {
//   ball: {
//     x: number,
//     y: number,
//     vx: number,
//     vy: number,
//   }
//       paddle1: number
//       paddle2: number
// }
//
// class Obstacle extends Phaser.Physics.Arcade.Image {
//   body: Phaser.Physics.Arcade.Body;
//
// 	constructor(scene: Phaser.Scene, x: number, y: number, color: string) {
// 		super(scene, x, y, 'assets', color + '1')
// 		scene.add.existing(this);
// 		scene.physics.add.existing(this);
// 		this.body.maxSpeed = 200;
// 		this.setImmovable().setVelocityY(this.body.maxSpeed).setCollideWorldBounds(true).setBounce(1)
// 	}
// }
//
// export class PongScene extends Phaser.Scene {
//
//     private ball: Ball;
//     private paddle1 : Paddle;
//     private paddle2 : Paddle;
//     private keys: any;
//     private scores: Array<number> = [0, 0];
//     private config: GameSettings;
//     private obstacles: Obstacle[];
//     private server: Server;
//
//     constructor(mode: string = "custom") {
//         super({ key: 'PongScene' })
//     }
//
//     preload()
//     {
//
//     }
//
// 	private parseConfig(config: GameSettings) {
//     this.config = config;
//     this.server = config.socket;
// 	}
//
//     updateWorld(obj: WorldState) {
//                 this.paddle1.y = obj.paddle1;
//                 this.paddle2.y = obj.paddle2;
//                 this.ball.x = obj.ball.x;
//                 this.ball.y = obj.ball.y;
//                 this.ball.setVelocity(obj.ball.vx, obj.ball.vy);
//     }
//
//     create(config) : void
//     {
//       this.parseConfig(config);
//       if (this.config.classic) {
//         console.log("Classic game.");
//       } else {
//         console.log("Custom game !");
//       }
//
//
//       //  Enable world bounds, but disable the sides (left, right, up, down)
//       this.physics.world.setBoundsCollision(false, false, true, true);
//
//       this.ball = new Ball(this, 400, 300);
//       this.ball.setData('uponStart', true);
//
//       this.paddle1 = new Paddle(this, 20, 300, 1);
//       this.paddle2 = new Paddle(this, 780, 300, 2);
//       this.physics.add.collider(this.ball, this.paddle1, this.hitPaddle, null, this);
//       this.physics.add.collider(this.ball, this.paddle2, this.hitPaddle, null, this);
//
//       this.scores = [0, 0];
//
//       if (!this.config.classic)
//       {
//         this.obstacles[0] = new Obstacle(this, 200, 300, 'red');;
//         this.obstacles[1] = new Obstacle(this, 300, 200, 'yellow');
//         this.obstacles[2] = new Obstacle(this, 600, 500,'blue');
//         this.obstacles[3] = new Obstacle(this, 500, 100, 'green');
//
//         this.obstacles.forEach((obstacle) => {
//           this.physics.add.collider(this.ball, obstacle, this.hitObstacle, null, this);
//         });
//       }
//
//         //  Input events
//       this.keys = this.input.keyboard.addKeys('s,w,i,k');
//
//       this.input.on('pointerup', function (pointer) {
//         if (this.ball.getData('uponStart'))
//         {
//             this.ball.setVelocity(-700, 0);
//             this.ball.setData('uponStart', false);
//         }
//       }, this);
//
//     }
//
//     private resetBall ()
//     {
//         this.ball.setVelocity(0);
//         this.ball.setPosition(400, 300);
//         this.ball.setData('uponStart', true);
//     }
//
//     private resetLevel () : void
//     {
// 		if (this.ball.x < 0) {
// 			this.scores[1] += 1;
// 		} else {
// 			this.scores[0] += 1;
// 		}
// 		if (this.scores[0] >= this.config.maxScore || this.scores[1] >= this.config.maxScore ) {
// 			this.scene.start("GameoverScene");
// 		}
//
//         this.resetBall();
//     }
//
// 	hitObstacle(ball : Ball, obstacle: Obstacle) {
// 		// // Make sure that the ball keeps the same speed;
// 		ball.body.speed = ball.body.maxSpeed;
// 		// // Make sure that the obstacle keeps the same speed;
// 		obstacle.body.speed = obstacle.body.maxSpeed;
//
//         this.sound.play('thud', { volume: 0.75 })
// 	}
//
//     hitPaddle(ball, paddle)
//     {
//         const minAngle = 30;
//         const percentage = Phaser.Math.Clamp((ball.y - paddle.y + paddle.width / 2) / paddle.width, 0, 1)
//         var newAngle = 180 + minAngle + (180 - 2 * minAngle) * percentage;
// 		// Mirror translation for the paddle on the left
//         if (ball.x < 300)
//             newAngle *= -1;
//         // convert to radian
//         newAngle *= Math.PI / 180;
//         ball.setVelocity(ball.body.maxSpeed * Math.sin(newAngle), ball.body.maxSpeed * Math.cos(newAngle));
//
//         this.sound.play('thud', { volume: 0.75 })
//     }
//
//     update()
//     {
//
//         if (this.ball.x < 0 || this.ball.x > 800)
//         {
//             this.resetLevel();
//         }
//
//         let world: WorldState = {
//           ball: {
//             x: this.ball.x,
//             y: this.ball.y,
//             vx: this.ball.body.velocity.x,
//             vy: this.ball.body.velocity.y,
//           },
//           paddle1: this.paddle1.y,
//           paddle2: this.paddle2.y,
//         }
//         this.server.emit("state", world);
//     }
// };
//
// const config = {
//     type: Phaser.HEADLESS,
//     width: 800,
//     height: 600,
//     physics: {
//         default: 'arcade',
//         arcade: {
//             debug: false
//         }
//     },
//     scene: [PongScene]
// }
//
// export class GameServer {
//
// 	constructor(private game = new Phaser.Game(config)) {
//       game.scene.add('PongScene', PongScene, false, {customPong: false});
//
// 	}
//
//     launch () {
//
//     }
//
// }
// import path from 'path';
// import jsdom from 'jsdom'
// const { JSDOM } = jsdom;
//
// function setupAuthoritativePhaser() {
//   console.log("Hello from setup")
//   JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
//     // To run the scripts in the html file
//     runScripts: "dangerously",
//     // Also load supported external resources
//     resources: "usable",
//     // So requestAnimatinFrame events fire
//     pretendToBeVisual: true
//   });
// }
