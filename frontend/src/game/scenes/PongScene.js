import { Scene } from 'phaser'

export default class PongScene extends Scene {

    constructor() {
        super({ key: 'PongScene' })
    }

    preload()
    {

    }

    create()
    {
        //  Enable world bounds, but disable the sides (left, right, up, down)
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);

        this.paddle1 = this.physics.add.image(20, 300, 'assets', 'paddle1').setImmovable();
        this.paddle1.angle = 90;
        let tmp = this.paddle1.width;
        this.paddle1.width = this.paddle1.height;
        this.paddle1.height = tmp;

        this.paddle2 = this.physics.add.image(780, 300, 'assets', 'paddle2').setImmovable();
        this.paddle2.setRotation(+ Math.PI / 2);

        console.log("Paddle1 " + this.paddle1.width);
        console.log("Paddle1 " + this.paddle1.height);

        //  Our colliders
        // this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle1, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.paddle2, this.hitPaddle, null, this);

        //  Input events
        this.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.paddle1.y = Phaser.Math.Clamp(pointer.y, 52, 748);

            if (this.ball.getData('onPaddle'))
            {
                this.ball.y = this.paddle1.y;
            }

        }, this);

        this.input.on('pointerup', function (pointer) {

            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-300, 0);
                this.ball.setData('onPaddle', false);
            }

        }, this);

    }

    resetBall()
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
        var minAngle = 20;
        console.log("diff = " + ball.y);
        var percentage = Phaser.Math.Clamp((ball.y - paddle.y) / 20, 0, 1)
        console.log("percentage: " + percentage);
        var newAngle = 180 + minAngle + (180 - 2 * minAngle) * percentage;
        if (ball.x < 300)
            newAngle *= -1;
        console.log("new angle: " + newAngle);
        // convert to radian
        newAngle *= Math.PI / 180;
        ball.setVelocity(300 * Math.sin(newAngle), 300 * Math.cos(newAngle));
        console.log("new velocity: " + JSON.stringify(ball.body.velocity));

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
