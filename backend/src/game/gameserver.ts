import { Engine, Bodies, Common, Collision, Body, Render, Runner, Composite, Events, World } from "matter-js";
// import Matter from 'matter-js';
import { Socket, Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { Game, GameStatus, User } from '@prisma/client';
import { PlayerMoveDto, PointWonDto, WorldStateDto } from "./dto/game.dto";
import { GameSettingsDto } from "./dto/joinQueueData.dto";

// At what pace the simulation is run
const fps = 60;
// At what frequency we send the state to the clients
const syncPerSec = 10;

const timeToStartBeforeAbort = 30000
const disconnectTimeoutDuration = 10000
// Duration of the countdown between the start (ms)
const countdownDuration = 3000

const worldWidth = 800;
const worldHeight = 600;
const wallThickness = 50;
// Yes, the ball is a rectangle (because of Phaser on client size)
const ballSize = {x: 22, y: 22}
const ballMaxSpeed = 10;
// Distance between the left/right wall to the paddle center
const paddleX = 20;
const paddleSize = {x: 24, y: 104}
// Round corner on the paddle
const cheaterDetectionLimit = 20;
// The minimum bouncing angle from the paddle
// The ball will go with an angle between x and (180 - x)
const bounceMinAngleDeg = 30;

const obstacles_def = [
  {x: worldWidth * 2 / 8, y: worldHeight * 2 / 8, color: 'red'},
  {x: worldWidth * 3 / 8, y: worldHeight * 3 / 8, color: 'yellow'},
  {x: worldWidth * 5 / 8, y: worldHeight * 5 / 8, color: 'green'},
  {x: worldWidth * 6 / 8, y: worldHeight * 6 / 8, color: 'blue'},
]

class Obstacle {
  public body: any; // Matter-js body
  public speed = {x: 0, y: 2};
  private width = 64;
  private height = 32;

  constructor(x: number, y: number) {
    const worldOption = {
      isStatic: true,
    }
    this.body = Bodies.rectangle(x, y, this.width, this.height, worldOption);
  }

  // Move up and down, boucing on the 'walls'
  update () {
    Body.translate(this.body, this.speed)
    if (this.body.position.x < this.width / 2 || this.body.position.x > worldWidth - this.width / 2)
      this.speed.x *= -1;
    if (this.body.position.y < this.height / 2 || this.body.position.y > worldHeight - this.height / 2)
      this.speed.y *= -1;
  }
}

export class GameServer {
  private ball: any;
  private paddle1: any;
  private paddle2: any;
  private IntervalUpdate: NodeJS.Timer;
  private IntervalSync: NodeJS.Timer;
  private disconnectTimeout: NodeJS.Timeout;
  private startTimeout: NodeJS.Timeout;
  private engine!: any;
  private roomID: string;
  private players: Socket[] = [];
  private scores: Array<number> = [0, 0];
  private maxScore: number = 5
  private obstacles: Obstacle[] = [];
  private status: GameStatus = "STARTED";
  private hasStarted = false;

  constructor(private server: Server,
              public game: Game,
              sockets: Socket[]) {
    this.roomID = String(this.game.id);
    this.players = [];
    this.players.push(sockets[0])
    this.players.push(sockets[1])

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
      Bodies.rectangle(worldWidth/2, -wallThickness/2, worldWidth, wallThickness, worldOption), // upper wall
      Bodies.rectangle(worldWidth/2, worldHeight + wallThickness/2, worldWidth, wallThickness, worldOption), // lower wall
      // Bodies.rectangle(-wall_thickness/2, worldHeight/2, wall_thickness, worldHeight, worldOption), // left wall
      // Bodies.rectangle(worldWidth + wall_thickness/2, worldHeight/2, wall_thickness, worldHeight, worldOption), // right wall
    ])

      if (game.type != "CLASSIC") {
        Logger.log(`Game#${this.roomID}: custom mode`);

        // Add obstacles
        obstacles_def.forEach((o) => {
          this.obstacles.push(new Obstacle(o.x, o.y))
        })
        this.obstacles.forEach((o) => {
          Composite.add(this.engine.world, o.body)
        })
      }

      // Players have a certain amount of time to start the game
      this.startTimeout = setTimeout(() => { this.onAbortGame("did not start") }, timeToStartBeforeAbort); }

  onPlayerMove(socket: Socket, playerMove: PlayerMoveDto) {
    const idx = this.players.indexOf(socket);
    Logger.log(`move from ${socket.data.user.username}, who is #${idx}`);
    let paddle: any;
    if (idx == 0)
      paddle = this.paddle1;
    else if (idx == 1)
      paddle = this.paddle2;
    else
      return;

    // Refuse too big movements
    if (playerMove.y - paddle.y > cheaterDetectionLimit) {
      Logger.log("Cheater");
      return;
    }

    Body.setPosition(paddle, {x: paddle.position.x, y: playerMove.y})
    socket.to(this.roomID).emit("enemyMove", playerMove);
  }

  onPlayerDisconnect(client: Socket) {
    if (!this.hasStarted)
      return;
    Logger.log(`Game#${this.roomID}: ${client.data.user.username} disconnected`);

    // check if already disconnected
    if (client.data.isReady) {
      client.data.isReady = false;
      this.onPause();
      client.to(this.roomID).emit("playerDisconnect")
      this.resetLevel();
      if (!this.disconnectTimeout)
        this.disconnectTimeout = setTimeout(() => { this.onAbortGame("player timeout") }, disconnectTimeoutDuration);
    }
    if (!this.players[0].data.isReady && !this.players[1].data.isReady)
      this.onAbortGame("both players disconnected");
  }

  onPlayerReconnect(client: Socket) {
    if (!this.hasStarted) {
      this.sendStateToClients()
      return;
    }

    Logger.log(`Game#${this.roomID}: ${client.data.user.username} reconnected`);
    clearTimeout(this.disconnectTimeout)

    // Socket shenanigans
    client.join(this.roomID);
    this.updateGameDataOnSockets();
    client.data.isReady = true;
    this.players.forEach((el, idx) => {
      if (el.data.user.id == client.data.user.id && el.disconnected) {
        this.players[idx] = client;
      }
    });
    this.sendStateToClients();

    this.server.to(this.roomID).emit("playerReconnect")

    this.onPause();
    // lauch ball after countdown
    setTimeout(() => {
      Body.setVelocity(this.ball, {x: -ballMaxSpeed, y: 0});
      this.onResume();
    }, 2000);
  }

  onPlayerIsReady(client: Socket) {
    Logger.log(`Game#${this.roomID}: ${client.data.user.username} is ready to play`);

    client.data.isReady = true;

    // Check if everybody is ready
    if (!this.hasStarted && this.players[0].data.isReady && this.players[1].data.isReady) {
      clearTimeout(this.startTimeout);
      Logger.log(`Game#${this.roomID}: Starting game !`);
      this.onStartGame();
    }
  }

  private onAbortGame(reason: string) {
    Logger.log(`Game#${this.roomID} aborted: ${reason}`);
    this.status = "ABORTED"

    this.cleanupGameDataOnSockets()
    this.server.to(this.roomID).emit("abortGame", reason)
  }

  private onGameover(pointWon: PointWonDto) {
      Logger.log(`Game#${this.roomID}: Gameover`);
      this.status = "ENDED"
      this.cleanupGameDataOnSockets()
      this.server.to(this.roomID).emit("gameover", pointWon)
  }

  onStartGame() {

    this.hasStarted =true;
    this.onResume();

    // Warn clients that we are about to start
    this.server.to(this.roomID).emit("startGame");

    // lauch ball after countdown
    setTimeout(() => {
      Body.setVelocity(this.ball, {x: -ballMaxSpeed, y: 0});
    }, countdownDuration);

  }

  private updateScore() {
    // Update score
    if (this.ball.position.x < 0) {
      this.scores[1] += 1;
    } else {
      this.scores[0] += 1;
    }
    Logger.log(`Game#${this.roomID}: ${this.scores[0]} - ${this.scores[1]}`);

    const pointWon: PointWonDto = {
      score1: this.scores[0],
      score2: this.scores[1],
    }
    if (this.scores[0] >= this.maxScore || this.scores[1] >= this.maxScore) {
      this.onGameover(pointWon);
    } else {
      this.server.to(this.roomID).emit("pointEnd", pointWon)
    }
  }

  private resetLevel(): void {

    // Reset ball
    Body.setVelocity(this.ball, {x: 0, y: 0});
    Body.setPosition(this.ball, {x:worldWidth / 2, y: worldHeight / 2});

    Body.setPosition(this.paddle1, {x:paddleX, y: worldHeight / 2});
    Body.setPosition(this.paddle2, {x:worldWidth - paddleX, y: worldHeight / 2});

    // TODO: Reset Obstacles

  }

  private onPause() {
    clearInterval(this.IntervalUpdate);
    clearInterval(this.IntervalSync);
  }

  private onResume() {
    // Start simulation
    this.updateWorld();
    this.IntervalUpdate = setInterval(() => { this.updateWorld(); }, 1000 / fps);

    // start syncing with client
    this.sendStateToClients();
    this.IntervalSync = setInterval(() => { this.sendStateToClients(); }, 1000 / syncPerSec);
  }

  private updateWorld() {

    Engine.update(this.engine, 1000 / fps);
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
    const world : WorldStateDto = {
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
    // Dont apply this when already past the paddle
    if ((ball.position.x < worldWidth / 2 && ball.position.x < paddle.position.x)
        || (ball.position.x > worldWidth / 2 && ball.position.x > paddle.position.x)) {
      return;
    }
    const percentage = Common.clamp((ball.position.y - paddle.position.y + paddleSize.y / 2) / paddleSize.y, 0, 1)
    var newAngle = 180 + bounceMinAngleDeg + (180 - 2 * bounceMinAngleDeg) * percentage;
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

  private updateGameDataOnSockets() {
    this.players.forEach((s) => {
      s.data.game = this.game;
      s.data.gameServer = this;
    })
  }

  private cleanupGameDataOnSockets() {
    this.players.forEach((s) => {
      s.data.game = null;
      s.data.gameServer = null;
    })
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getPlayers(): User[] {
    let players = [];
    players.push(this.players[0].data.user);
    players.push(this.players[1].data.user);
    return players;
  }

  getScore(): Array<number> {
    return this.scores;
  }

  toGameSettingsDto(): GameSettingsDto {
    const users = this.getPlayers();
    return {
      game: this.game,
      player1: users[0],
      player2: users[1],
    };
  }
};
