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
		if (c === undefined)
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

		constructor(public speed: vector = new vector()) {
			super();
			this.speed = {x: 5, y: 0};
			this.radius = 10;
		}

		move() {
			this.pos.x += this.speed.x;
			this.pos.y += this.speed.y;
		}

        draw(ctx)
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
		speed: number;

		constructor(pos: vector, size: vector) {
			super(pos, size);
			this.speed = 0;
		}

		move() {
			this.pos.y = clamp(this.pos.y + this.speed, 0, canvas.height - this.size.y)

		}

		draw(ctx) {
			ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		}

    }

    // declaration des variables
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
	var keyboard: { [id: string] : boolean } = {};

    var paddle1 = new Paddle({x: 20, y: canvas.height / 2}, {x: 20, y: 100});
    var paddle2 = new Paddle({x: canvas.width - 40, y: canvas.height / 2}, {x: 20, y: 100});
    var ball = new Ball();

    var reset = 1;
	var onGameOver = 0;
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
        ctx.fillText(scoreRight, 500, 80);
        ctx.fillText(scoreLeft, 350, 80);
    }
    // fin de partie
    function gameOver(){
        ctx.font = '100px serif';
        ctx.fillText('GAME OVER', 150, 330)
		onGameOver = 1;
    }

    function winner(){
        if (scoreLeft == maxScore)
        {
            ctx.font = '70px serif';
            ctx.fillText('Player left wins', 180, 500)
        }
        else if (scoreRight == maxScore)
        {
            ctx.font = '70px serif';
            ctx.fillText('Player right wins', 180, 500)
        }
    }

	function handleInputs(){

		paddle1.speed = 0;
		if (keyboard["w"])
			paddle1.speed -= 10;
		else if (keyboard["s"])
			paddle1.speed += 10;

		paddle2.speed = 0;
		if (keyboard["ArrowUp"])
			paddle2.speed -= 10;
		else if (keyboard["ArrowDown"])
			paddle2.speed += 10;

		if (onGameOver && keyboard["r"]) {
			onReset()
			scoreLeft = 0;
			scoreRight = 0;
			onGameOver = 0;
		}

	}

	function onReset() {
		paddle1.pos.y = canvas.height / 2 - paddle1.size.y / 2;
		paddle2.pos.y = canvas.height / 2 - paddle2.size.y / 2;
		ball.pos.x = canvas.width / 2;
		ball.pos.y = canvas.height / 2;
		ball.speed.x = 5;
		ball.speed.y = 0;

		reset = 0;
		console.log("Reset");
	}

	function reflectionAngle(ball: Ball, paddle: Paddle) : number {
		var minAngle = 30;
		var percentage = clamp((ball.pos.y - paddle.pos.y) / paddle.size.y, 0, 1)
		var newAngle = minAngle + (180 - 2 * minAngle) * percentage;
		if (ball.speed.x > 0)
			newAngle += 180;
		ball.speed.x = Math.sin(newAngle * Math.PI / 180) * 5;
		ball.speed.y = Math.cos(newAngle * Math.PI / 180) * 5;
	}

	function update() {

		if (ball.intersectRect(paddle1)) {
			reflectionAngle(ball, paddle1);
		}
		if (ball.intersectRect(paddle2)) {
			reflectionAngle(ball, paddle2);
		}
		if (ball.pos.x < 0) {
			scoreRight += 1;
			reset = 1;
		}
		if (ball.pos.x > canvas.width) {
			scoreLeft += 1;
			reset = 1;
		}
		if (ball.pos.y < ball.radius || ball.pos.y > canvas.height - ball.radius) {
			ball.speed.y *= -1;
		}

		paddle1.move();
		paddle2.move();
		ball.move();
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
        if(reset == 0)
        {
			draw();
        }
        else if (reset == 1)
        {
            if (scoreLeft < maxScore && scoreRight < maxScore){
				onReset();
            }
            else
                gameOver();
                winner();
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
