import { Engine, Bodies, Common, Collision, Body, Render, Runner, Composite, Events, World } from "matter-js";
// import Matter from 'matter-js';
import { Socket, Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { Game } from '@prisma/client';

// At what pace the simulation is run
const fps = 60;
// At what frequency we send the state to the clients
const syncPerSec = 10;
// Duration of the countdown between the start (ms)
const CountdownDuration = 3000

const ballMaxSpeed = 10;
const world_width = 800;
const world_height = 600;
const wall_thickness = 50;
const obstacles_def = [
  {x: 200, y: 300, color: 'red'},
  {x: 300, y: 200, color: 'yellow'},
  {x: 500, y: 100, color: 'green'},
  {x: 600, y: 500, color: 'blue'},
]

type PlayerMoveDto = {
  y: number
}

class Obstacle {
  public body: any; // Matter-js body
  private maxSpeed = 2;
  private dir = 1;

  constructor(x: number, y: number) {
    // Body.setInertia(this.body, Infinity)
    // this.setBounce(1);
    // this.setStatic(true);
    // this.setFriction(0);
    // this.setVelocity(0, 2);
    const worldOption = {
      isStatic: true,
    }
    this.body = Bodies.rectangle(x, y, 64, 32, worldOption);
  }

  // Move up and down, boucing on the 'walls'
  update () {
    Body.translate(this.body, {x: 0, y: this.dir * this.maxSpeed})
    if (this.body.position.y < 15 || this.body.position.y > 585)
      this.dir *= -1;
  }

}


export class GameServer {
  private ball: any;
  private paddle1: any;
  private paddle2: any;
  private IntervalUpdate: any;
  private IntervalSync: any;
  private engine!: any;
  private roomID: string;
  private players: any;
  private scores: Array<number> = [0, 0];
  private maxScore: number = 3
  private obstacles = [];
  private canPlayerMove: boolean = false;

  constructor(private server: Server,
              private game: Game,
              sockets: Socket[]) {
    this.roomID = String(this.game.id);
    this.players = [];
    this.players.push(sockets[0])
    this.players.push(sockets[1])

    // Init MatterJS
    this.engine = Engine.create();
    this.engine.gravity.y = 0;


    this.ball = Bodies.rectangle(world_width / 2, world_height / 2, 22, 22);
    Body.setInertia(this.ball, Infinity);
    this.ball.friction = 0;
    this.ball.frictionAir = 0;
    this.ball.frictionStatic = 0;
    this.ball.restitution = 1;
    Composite.add(this.engine.world, this.ball);

    this.paddle1 = Bodies.rectangle(20, 300, 24, 104, {isStatic: true});
    Body.setInertia(this.paddle1, Infinity);
    Composite.add(this.engine.world, this.paddle1);
    this.paddle2 = Bodies.rectangle(780, 300, 24, 104, {isStatic: true});
    Body.setInertia(this.paddle2, Infinity);
    Composite.add(this.engine.world, this.paddle2);

    // Walls
    const worldOption = { isStatic: true };
    Composite.add(this.engine.world, [
      Bodies.rectangle(world_width/2, -wall_thickness/2, world_width, wall_thickness, worldOption), // upper wall
      Bodies.rectangle(world_width/2, world_height + wall_thickness/2, world_width, wall_thickness, worldOption), // lower wall
      Bodies.rectangle(-wall_thickness/2, world_height/2, wall_thickness, world_height, worldOption), // left wall
      Bodies.rectangle(world_width + wall_thickness/2, world_height/2, wall_thickness, world_height, worldOption)]) // right wall

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

    // TODO: remove
    // this.onStartGame();
  }

  onPlayerMove(socket: Socket, playerMove: PlayerMoveDto) {
    const idx = this.players.indexOf(socket);
    // Logger.log(`Game#${this.roomID}: PlayerMove from idx ${idx}: ${JSON.stringify(playerMove)}`);
    if (idx == 0)
      Body.setPosition(this.paddle2, {x: this.paddle2.position.x, y: playerMove.y})
    else if (idx == 1)
      Body.setPosition(this.paddle1, {x: this.paddle1.position.x, y: playerMove.y})
    socket.to(this.roomID).emit("enemyMove", playerMove);
  }

  onPlayerDisconnect(client: Socket) {
    Logger.log(`Game#${this.roomID}: ${client.data.user.username} disconnected. abort game`);
    clearInterval(this.IntervalUpdate);
    clearInterval(this.IntervalSync);
    this.players[0].data.game = null;
    this.players[0].data.gameServer = null;
    this.players[1].data.game = null;
    this.players[1].data.gameServer = null;
    this.server.to(this.roomID).emit("playerDisconnect")
  }

  onPlayerIsReady(client: Socket) {
    Logger.log(`Game#${this.roomID}: ${client.data.user.username} is ready to play`);

    client.data.isReady = true;

    // Check if everybody is ready
    if (this.players[0].data.isReady && this.players[1].data.isReady)
      this.onStartGame();
  }

  onStartGame() {
    Logger.log(`Game#${this.roomID}: Starting game !`);
    //
    // Warn clients that we are about to start
    this.server.to(this.roomID).emit("startGame");

    // lauch ball after countdown
    setTimeout(() => {
      Body.setVelocity(this.ball, {x: -ballMaxSpeed, y: 0});
    }, CountdownDuration);

    // Start simulation after countdown
    this.updateWorld();
    this.IntervalUpdate = setInterval(() => { this.updateWorld(); }, 1000 / fps);

    // start syncing with client after countdown
    this.sendStateToClients();
    this.IntervalSync = setInterval(() => { this.sendStateToClients(); }, 1000 / syncPerSec);
  }

  private resetLevel(): void {

    Logger.log(`Game#${this.roomID}: Reset level !`);
    if (this.ball.position.x < 0) {
      this.scores[1] += 1;
    } else {
      this.scores[0] += 1;
    }
    //
    if (this.scores[0] >= this.maxScore || this.scores[1] >= this.maxScore) {
      Logger.log(`Game#${this.roomID}: Game over !`)
      this.server.to(this.roomID).emit("gameover")
      return;
    } else {
      Logger.log(`Game#${this.roomID}: point ended`);
      this.server.to(this.roomID).emit("pointEnd")
      // Reset ball
      this.ball.setVelocity(0);
      this.ball.setPosition(world_width / 2, world_width / 2);
    }

    clearInterval(this.IntervalUpdate);
    clearInterval(this.IntervalSync);
  }

  updateWorld() {
    Engine.update(this.engine, 1000 / fps);

    // Just a fix for some crazy stuff happening
    if (Body.getSpeed(this.ball) > ballMaxSpeed)
      Body.setSpeed(this.ball, ballMaxSpeed);

    if (Collision.collides(this.ball, this.paddle1, null)) {
      this.hitPaddle(this.ball, this.paddle1)
    }
    if (Collision.collides(this.ball, this.paddle2, null)) {
      this.hitPaddle(this.ball, this.paddle2)
    }

    if (this.ball.x < 0 || this.ball.x > 800) {
      this.resetLevel();
    }

    this.obstacles.forEach((o) => o.update())
  }

  sendStateToClients() {

    const world : WorldState = {
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
    }))
    this.server.to(String(this.game.id)).emit("state", world)

  }

  hitPaddle(ball: any, paddle: any) {
    const minAngle = 30;
    const percentage = Common.clamp((ball.position.y - paddle.position.y + 104 / 2) / 104, 0, 1)
    var newAngle = 180 + minAngle + (180 - 2 * minAngle) * percentage;
    // Mirror translation for the paddle on the left
    if (ball.position.x < 300)
      newAngle *= -1;
    // convert to radian
    newAngle *= Math.PI / 180;
    Body.setVelocity(this.ball, {
      x: ballMaxSpeed * Math.sin(newAngle),
      y: ballMaxSpeed * Math.cos(newAngle)
    });
  }
};

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
  }[]
}
