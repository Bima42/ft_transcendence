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
        x: number;
        y: number;
    };

    class Circle {
        pos: vector;
        radius: number;
    }

    class Ball extends Circle {
        render(ctx)
        {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI*2);
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
        intersect(r: Rectangle) : boolean {
            if (this.pos.x + this.size.x < r.pos.x ||
                r.pos.x + r.size.x < this.pos.x ||
                this.pos.y + this.size.y < r.pos.y ||
                r.pos.y + r.size.y < this.pos.y) {
                return false;
            }
            return true;
        }

        intersect(c: Circle) : boolean {
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
			ctx.fillStyle = "red";
			ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        ctx.fillStyle = "black";

		}

    }

    // declaration des variables
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    var paddle1 = new Paddle({x: 20, y: canvas.height / 2}, {x: 20, y: 100});
    var paddle2 = new Paddle({x: canvas.width - 40, y: canvas.height / 2}, {x: 20, y: 100});
    var ball = new Ball();
    var keyboard: { [id: string] : boolean } = {};
    var speed = new Array<number>(2);

    var onMove = 0;



    var x = canvas.width/2;
    var y = canvas.height/2;
    var speedX = 5;
    var speedY = 0;
    var dirX = 1;
    var paddleHeight = 100;
    var paddleWidth = 20;
    var paddleLeftY = canvas.height/2;
    var paddleRightY = canvas.height/2;
    var reset = 0;
    var scoreRight = 0;
    var scoreLeft = 0;
    var maxScore = 3;

    // dessin et mouvement de la balle
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI*2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    // mouvements axe X et Y
        if (x >= 50 && x <= canvas.width -50)
        {
            // Rebond paddleRight
            if (x == 850)
            {
                if (y > paddleRightY - 50 && y < paddleRightY + 50){
                    speedX *= -1;
                    if (y > paddleRightY - 50 && y < paddleRightY)
                        speedY = -3;
                    if (y < paddleRightY + 50 && y > paddleRightY)
                        speedY = 3;
                }
                else{
                    scoreLeft += 1;
                    reset = 1;
                }
            }
            if (x == 50) // Rebond paddleLeft
            {
                if (y > paddleLeftY - 50 && y < paddleLeftY + 50){
                    speedX *= -1;
                    if (y > paddleLeftY - 50 && y < paddleLeftY)
                        speedY = -3;
                    if (y < paddleLeftY + 50 && y > paddleLeftY)
                        speedY = 3;
                }
                else{
                    scoreRight += 1;
                    reset = 1;
                }
            }
            x += speedX;
            if (y <= 1|| y >= 599) // Rebond haut et bas
            {
                speedY *= -1;
            }
            y += speedY;
        }
    }
    // ligne de separation
    function drawMiddleLine() {
        ctx.fillRect(canvas.width/2 -2 ,0,4,600);
    }
    // les paddles
    function drawPaddleLeft(){
        ctx.fillRect(20,paddleLeftY - 55 , paddleWidth, paddleHeight);
    }
    function drawpaddleRight(){
        ctx.fillRect(canvas.width - 40 ,paddleRightY - 55 , paddleWidth, paddleHeight);
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
		paddle1.move();

		paddle2.speed = 0;
		if (keyboard["ArrowUp"])
			paddle2.speed -= 10;
		else if (keyboard["ArrowDown"])
			paddle2.speed += 10;
		paddle2.move();

	}

	function reset() {
		paddle1.pos.y = canvas.height / 2;
		paddle2.pos.y = canvas.height / 2;

	}

    // fonction principale
    function draw() {

		handleInputs();



		if (keyboard["ArrowUp"]) paddleRightY = clamp(paddleRightY + paddle1.speed, 50, canvas.height - 40);
		if (keyboard["ArrowDown"]) paddleRightY = clamp(paddleRightY - 10, 50, canvas.height - 40);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(reset == 0)
        {
            drawScores();
            drawBall();
            drawMiddleLine();
            drawPaddleLeft();
            drawpaddleRight();
			paddle1.draw(ctx);
			paddle2.draw(ctx);
        }
        else if (reset == 1)
        {
            if (scoreLeft < maxScore && scoreRight < maxScore){
                paddleLeftY = canvas.height/2;
                paddleRightY = canvas.height/2;
                dirX *= -1;
                y = canvas.height/2;
                x = canvas.width/2;
                speedY = 0;
                speedX = 5 * dirX;
                reset = 0;

            }
            else
                gameOver();
                winner();
        }
    }
    // ecoute des evenements clavier pour paddleRight (up/down)
    document.addEventListener("keydown", function(event)
    {
        keyboard[event.key] = true;
        if (event.key == "ArrowUp")
        {
            onMove = 1;
        }
        else if (event.key == "ArrowDown")
        {
            onMove = -1;
        }
    });
    document.addEventListener("keyup", function(event)
    {
        keyboard[event.key] = false;
        if (event.key == "ArrowUp" && paddleRightY != 50) // Touche "haut"
        {
            onMove = 0;
        }
        else if (event.key == "ArrowDown") // Touche "bas"
        {
            onMove = 0;
        }
    });
    // ecoute des evenements clavier pour paddleLeft (w/s)
    document.addEventListener("keydown", function(event)
    {
        if (event.keyCode == 87 && paddleLeftY != 50) // Touche "haut"
        {
            paddleLeftY -= 10;
        }
        else if (event.keyCode == 83 && paddleLeftY != canvas.height - 40) // Touche "bas"
        {
            paddleLeftY += 10;
        }
    });

    // boucle affichage
    setInterval(draw, 16);
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
