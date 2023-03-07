<template>
    <section class="gamePong">
        <div>
            <canvas id="game" width="900" height="600"></canvas>
        </div>
    </section>
</template>

<script lang="ts">

export default {
  name: 'pong',
  mounted() {

    function clamp(value: number, min: number, max: number) {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }

    class vector {

		constructor(public x: number = 0, public y: number = 0) {}
    };

    class Circle {

		constructor(public pos: vector = new vector(), public radius: number) {
		}

		intersectCircle(c: Circle) {
			var diff: vector = {
				x: this.pos.x - c.pos.x,
				y: this.pos.y - c.pos.y};
			var distSquared = diff.x*diff.x + diff.y*diff.y;
			var sumRad = this.radius + c.radius;
			return distSquared < sumRad * sumRad;
		}

		intersectRect(r: Rectangle) {
			return r.intersectCircle(this);
		}
    }

    class Ball extends Circle {

		constructor(public speed: number = 5, public dir: vector = new vector()) {
			super({x:0, y:0}, 10);
			this.dir = {x: 1, y: 0};
		}

		move() {

			// Create a circle at the next position, in order to see if it
			// WILL collide
			var nextBall = new Circle(this.pos, this.radius);
			nextBall.pos.x += this.dir.x;
			nextBall.pos.y += this.dir.y;

			if (nextBall.intersectRect(paddle1) && this.pos.x > paddle1.pos.x) {
				reflectionAngle(this, paddle1);
			}
			if (nextBall.intersectRect(paddle2) && this.pos.x < paddle2.pos.x + paddle2.size.x) {
				reflectionAngle(this, paddle2);
			}

			// Intersection with upper and lower walls
			if (this.pos.y < this.radius || this.pos.y > canvas.height - this.radius) {
				this.dir.y *= -1;
			}

			// Player 1 is cheating
			// if (this.pos.x < this.radius)
			// 	this.dir.x *= -1;

			this.pos.x += this.speed * this.dir.x;
			this.pos.y += this.speed * this.dir.y;
		}

        draw(ctx: CanvasRenderingContext2D)
        {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2);
			ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
        }

    }

    class Rectangle {
        pos: vector;
        size: vector;

		constructor(pos: vector, size: vector) {
			this.pos = pos;
			this.size = size;
		}

        intersectRect(r: Rectangle) : boolean {
            if (this.pos.x + this.size.x < r.pos.x ||
                r.pos.x + r.size.x < this.pos.x ||
                this.pos.y + this.size.y < r.pos.y ||
                r.pos.y + r.size.y < this.pos.y) {
                return false;
            }
            return true;
        }

		// Only works with 'straight' rectangle, i.e. with vertical/horizontal sides
        intersectCircle(c: Circle) : boolean {
            var closestPoint: vector = {
                x: clamp(c.pos.x, this.pos.x, this.pos.x + this.size.x),
                y: clamp(c.pos.y, this.pos.y, this.pos.y + this.size.y)
            }
            var diff: vector = {
                x: c.pos.x - closestPoint.x,
                y: c.pos.y - closestPoint.y
            }
            var distanceSquared = diff.x * diff.x + diff.y * diff.y;
            return distanceSquared < (c.radius * c.radius);
        }
    };

    class Paddle extends Rectangle {
		curSpeed: number;
		topSpeed: number;
		static defaultSpeed: number = 10;

		constructor(pos: vector, size: vector) {
			super(pos, size);
			this.topSpeed = Paddle.defaultSpeed;
			this.topSpeed = 10;
			this.curSpeed = 0;
		}

		move() {
			this.pos.y = clamp(this.pos.y + this.curSpeed, - this.size.y / 2, canvas.height - this.size.y / 2)

		}

		draw(ctx) {
			ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		}

    }

    // declaration des variables
    var canvas = document.getElementById("game");
    var ctx : CanvasRenderingContext2D = canvas?.getContext("2d");
	var keyboard: { [id: string] : boolean } = {};

    var paddle1 = new Paddle({x: 20, y: canvas.height / 2}, {x: 20, y: 100});
    var paddle2 = new Paddle({x: canvas.width - 40, y: canvas.height / 2}, {x: 20, y: 100});
    var ball = new Ball();

    var reset = 1;
	var gameOver = 0;
    var scoreRight = 0;
    var scoreLeft = 0;
    var maxScore = 3;

    // ligne de separation
    function drawMiddleLine() {
        ctx.fillRect(canvas.width/2 -2 ,0,4,600);
    }
    // scores
    function drawScores(){
        ctx.font = '70px serif';
        ctx.fillText(String(scoreRight), 500, 80);
        ctx.fillText(String(scoreLeft), 350, 80);
    }
    // fin de partie
    function onGameOver(){
        ctx.font = '100px serif';
		ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 230)
        ctx.font = '50px serif';
        ctx.fillText('Press r to replay', canvas.width / 2, 530)
		winner();
    }

    function winner(){
		ctx.font = '70px serif';
		ctx.textAlign = 'center';
		var txt = "Player right wins";
		if (scoreLeft > scoreRight) {
			txt = "Player left wins";
        }
		else if (scoreRight == scoreLeft) {
			txt = "It's a tie !";
		}
    	ctx.fillText(txt, canvas.width / 2, 430)
    }

	function handleInputs(){

		paddle1.curSpeed = 0;
		if (keyboard["w"])
			paddle1.curSpeed -= paddle1.topSpeed;
		if (keyboard["s"])
			paddle1.curSpeed += paddle1.topSpeed;

		paddle2.curSpeed = 0;
		if (keyboard["ArrowUp"])
			paddle2.curSpeed -= paddle2.topSpeed;
		if (keyboard["ArrowDown"])
			paddle2.curSpeed += paddle2.topSpeed;

		if (gameOver && keyboard["r"]) {
			onReset()
			scoreLeft = 0;
			scoreRight = 0;
			gameOver = 0;
		}
	}

	function onReset() {
		paddle1.pos.y = canvas.height / 2 - paddle1.size.y / 2;
		paddle2.pos.y = canvas.height / 2 - paddle2.size.y / 2;
		paddle1.topSpeed = paddle2.topSpeed = Paddle.defaultSpeed;
		ball.pos.x = canvas.width / 2;
		ball.pos.y = canvas.height / 2;
		ball.dir.x = 1;
		ball.dir.y = 0;
		ball.speed = 10;

		reset = 0;
		console.log("Reset");
	}

	function reflectionAngle(ball: Ball, paddle: Paddle) {
		var minAngle = 20;
		var percentage = clamp((ball.pos.y - paddle.pos.y) / paddle.size.y, 0, 1)
		var newAngle = 180 + minAngle + (180 - 2 * minAngle) * percentage;
		if (ball.dir.x < 0)
			newAngle *= -1;
		ball.dir.x = Math.sin(newAngle * Math.PI / 180);
		ball.dir.y = Math.cos(newAngle * Math.PI / 180);
	}

	function update() {

		paddle1.move();
		paddle2.move();
		ball.move();

		if (ball.pos.x < 0) {
			scoreRight += 1;
			reset = 1;
		}
		if (ball.pos.x > canvas.width) {
			scoreLeft += 1;
			reset = 1;
		}

		if (scoreLeft >= maxScore || scoreRight >= maxScore) {
			gameOver = 1;
		}
	}


	function draw() {

		// dessin et mouvement de la balle
		ball.draw(ctx);
		paddle1.draw(ctx);
		paddle2.draw(ctx);

		drawScores();
		drawMiddleLine();
	}

    // fonction principale
    function loop() {

		// User input
		handleInputs();

		// Apply velocities to positions
		update();

		// Draw everything on screen
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (gameOver) {
			onGameOver();
		}
		else {
			if(reset == 1) {
				onReset();
			}

			draw();
		}
    }
    // ecoute des evenements clavier
    document.addEventListener("keydown", function(event)
    {
        keyboard[event.key] = true;
    });
    document.addEventListener("keyup", function(event)
    {
        keyboard[event.key] = false;
    });

    // boucle affichage
    setInterval(loop, 20);
  }
};
</script>

<style scoped lang="scss">
    .gamePong {
        grid-area: $main;
    }
    canvas {
    background-color: whitesmoke;
    display: block;
    margin: auto;
  }
</style>
