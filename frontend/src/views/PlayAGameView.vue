<template>
    <section class="gamePong">
        <div>
            <canvas id="game" width="900" height="600"></canvas>            
        </div>
    </section>
</template>

<script lang="js">

export default {
  name: 'pong',
  mounted() {

    // declaration des variables
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

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
    // fonction principale
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(reset == 0)
        {
            drawScores();
            drawBall();
            drawMiddleLine();
            drawPaddleLeft();
            drawpaddleRight();
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
        if (event.keyCode == 38 && paddleRightY != 50) // Touche "haut"
        { 
            paddleRightY -= 10;
        } 
        else if (event.keyCode == 40 && paddleRightY != canvas.height - 40) // Touche "bas"
        {
            paddleRightY += 10;
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
    setInterval(draw, 20);
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
