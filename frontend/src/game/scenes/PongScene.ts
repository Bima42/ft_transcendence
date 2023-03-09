import 'phaser'
// import type GameObjects from 'phaser'
//
//
class Ball extends Phaser.Physics.Arcade.Image {

	maxSpeed: number = 700;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'assets', 'ball1')
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCollideWorldBounds(true).setBounce(1);
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

	}

}

export default class PongScene extends Phaser.Scene {

    private ball: Ball;
    private paddle1 : Paddle;
    private paddle2 : Paddle;

    constructor() {
        super({ key: 'PongScene' })
    }

    preload()
    {

    }

    create() : void
    {
        //  Enable world bounds, but disable the sides (left, right, up, down)
        this.physics.world.setBoundsCollision(false, false, true, true);

		this.ball = new Ball(this, 400, 300);
        this.ball.setData('onPaddle', true);

        this.paddle1 = new Paddle(this, 20, 300, 1);
        this.paddle2 = new Paddle(this, 780, 300, 2);

        //  Our colliders
        this.physics.add.collider(this.ball, this.paddle1, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.paddle2, this.hitPaddle, null, this);

        //  Input events
        this.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.paddle1.y = Phaser.Math.Clamp(pointer.y, 0, 800);

            if (this.ball.getData('onPaddle'))
            {
                this.ball.y = this.paddle1.y;
            }

        }, this);

        this.input.on('pointerup', function (pointer) {

            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-700, 0);
                this.ball.setData('onPaddle', false);
            }

        }, this);

    }

    private resetBall()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(400, 300);
        this.ball.setData('onPaddle', true);
    }

    resetLevel()
    {
        this.resetBall();
    }

    hitPaddle(ball, paddle)
    {
        const minAngle = 30;
        const percentage = Phaser.Math.Clamp((ball.y - paddle.y + paddle.width / 2) / paddle.width, 0, 1)
        var newAngle = 180 + minAngle + (180 - 2 * minAngle) * percentage;
        if (ball.x < 300)
            newAngle *= -1;
        // convert to radian
        newAngle *= Math.PI / 180;
        ball.setVelocity(ball.maxSpeed * Math.sin(newAngle), ball.maxSpeed * Math.cos(newAngle));

        this.sound.play('thud', { volume: 0.75 })
    }

    update()
    {
        if (this.ball.x < 0 || this.ball.x > 800)
        {
            this.resetBall();
        }
    }

};
