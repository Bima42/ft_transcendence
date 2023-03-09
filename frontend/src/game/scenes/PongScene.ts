import 'phaser'
// import type GameObjects from 'phaser'
//
//
class Ball extends Phaser.Physics.Arcade.Image {

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'assets', 'ball1')
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCollideWorldBounds(true).setBounce(1);
		this.body.maxSpeed = 700;
	}

}

class Paddle extends Phaser.Physics.Arcade.Image {


	constructor(scene: Phaser.Scene, x: number, y: number, nPlayer: number) {
		super(scene, x, y, 'assets', 'paddle' + nPlayer)
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setImmovable();
        this.angle = 90;
		this.setSize(this.height, this.width, true);
		this.body.maxSpeed = 700;
	}

	update() {

	}

}

class Obstacle extends Phaser.Physics.Arcade.Image {

	constructor(scene: Phaser.Scene, x: number, y: number, color: string) {
		super(scene, x, y, 'assets', color + '1')
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.body.maxSpeed = 200;
		this.setImmovable().setVelocityY(this.body.maxSpeed).setCollideWorldBounds(true).setBounce(1)
	}
}

export default class PongScene extends Phaser.Scene {

    private ball: Ball;
    private paddle1 : Paddle;
    private paddle2 : Paddle;
	private keys;
	private customPong : boolean;

    constructor(mode: string = "custom") {
        super({ key: 'PongScene' })
    }

    preload()
    {

    }

    create(config) : void
    {
		this.customPong = config.customPong;
		if (config.customPong) {
			console.log("Custom game !");
		} else {
			console.log("Classic game.");
		}

        //  Enable world bounds, but disable the sides (left, right, up, down)
        this.physics.world.setBoundsCollision(false, false, true, true);

		this.ball = new Ball(this, 400, 300);
		this.ball.setData('uponStart', true);

        this.paddle1 = new Paddle(this, 20, 300, 1);
        this.paddle2 = new Paddle(this, 780, 300, 2);
        this.physics.add.collider(this.ball, this.paddle1, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.paddle2, this.hitPaddle, null, this);

		if (this.customPong)
		{
			this.obstacle1 = new Obstacle(this, 200, 300, 'red');;
			this.obstacle2 = new Obstacle(this, 300, 200, 'yellow');
			this.obstacle3 = new Obstacle(this, 600, 500,'blue');
			this.obstacle4 = new Obstacle(this, 500, 100, 'green');

			this.physics.add.collider(this.ball, this.obstacle1, this.hitObstacle, null, this);
			this.physics.add.collider(this.ball, this.obstacle2, this.hitObstacle, null, this);
			this.physics.add.collider(this.ball, this.obstacle3, this.hitObstacle, null, this);
			this.physics.add.collider(this.ball, this.obstacle4, this.hitObstacle, null, this);
		}

        //  Input events
		this.keys = this.input.keyboard.addKeys('s,w,i,k');

        this.input.on('pointerup', function (pointer) {

            if (this.ball.getData('uponStart'))
            {
                this.ball.setVelocity(-700, 0);
                this.ball.setData('uponStart', false);
            }

        }, this);

    }

    private resetBall ()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(400, 300);
        this.ball.setData('uponStart', true);
    }

    private resetLevel () : void
    {
        this.resetBall();
    }

	hitObstacle(ball : Ball, obstacle: Obstacle) {
		// // Make sure that the ball keeps the same speed;
		ball.body.speed = ball.maxSpeed;
		// // Make sure that the obstacle keeps the same speed;
		obstacle.body.speed = obstacle.maxSpeed;

        this.sound.play('thud', { volume: 0.75 })
	}

    hitPaddle(ball, paddle)
    {
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

    update()
    {
        if (this.ball.x < 0 || this.ball.x > 800)
        {
            this.resetBall();
        }

		this.paddle1.setVelocity(0);
		if ( this.keys.s.isDown) { this.paddle1.setVelocityY(this.paddle1.body.maxSpeed); }
		if ( this.keys.w.isDown) { this.paddle1.setVelocityY(-this.paddle1.body.maxSpeed); }
		this.paddle1.y = Phaser.Math.Clamp(this.paddle1.y, 0, 600);

		this.paddle2.setVelocity(0);
		if ( this.keys.i.isDown) { this.paddle2.setVelocityY(-this.paddle2.body.maxSpeed); }
		if ( this.keys.k.isDown) { this.paddle2.setVelocityY(this.paddle2.body.maxSpeed); }
		this.paddle2.y = Phaser.Math.Clamp(this.paddle2.y, 0, 600);
    }

};
