<template>
    <section class="test">
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
    var dx = 5;
    var dy = 0;
    var dirx = 1;
    var diry = 0;
    var paddleHeight = 100;
    var paddleWidth = 20;
    var paddleLeftY = canvas.height/2;
    var paddleRightY = canvas.height/2;
    var reset = 0;
    var scoreRight = 0;
    var scoreLeft = 0;

    // dessin et mouvement de la balle
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI*2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        if (x <= 850 && dirx == 1)
        {
            if (x == 850 && !(y >= (paddleRightY - 50) && y <= (paddleRightY + 50)))
            {
                scoreLeft++;
                reset = 1;
                x = canvas.width/2;
            } 
            x += dx;
        }
        else if (x >= 50)
        {
            if (x == 50 && !(y >= (paddleLeftY - 50) && y <= (paddleLeftY + 50)))
            {
                scoreRight++;
                reset = 1;
                x = canvas.width/2;
            }
            dirx = -1;
            x -= dx;
        }
        else
            dirx = 1;

        // if ((y > (canvas.height / canvas.height)) && diry == 0)
        // {
        //     y += dy;
        // }
        // else if (y < 599)
        // {
        //     diry = 1;
        //     y -= dy;
        // }
        // else
        //     diry = 0;
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
    function drawScoreRight(){
        ctx.font = '70px serif';
        ctx.fillText(scoreRight, 500, 80);
    }
    
    function drawScoreLeft(){
        ctx.font = '70px serif';
        ctx.fillText(scoreLeft, 350, 80);
    }

    // fin de partie
    function gameOver(){
        ctx.font = '100px serif';
        ctx.fillText('GAME OVER', 150, 330)
    }

    function winner(){
        if (scoreLeft == 3)
        {
            ctx.font = '70px serif';
            ctx.fillText('Player left wins', 180, 500)
        }
        else if (scoreRight == 3)
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
            drawScoreRight();
            drawScoreLeft();
            drawBall();
            drawMiddleLine();
            drawPaddleLeft();
            drawpaddleRight();
        }
        else if (reset == 1)
        {
            if (scoreLeft < 3 && scoreRight < 3){
                paddleLeftY = canvas.height/2;
                paddleRightY = canvas.height/2;
                dirx = (-1*dirx);
                reset = 0;
            }
            else
                gameOver();
                winner();
        }
    }

    // ecoute des evenements clavier pour paddleRight
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
    .test {
        grid-area: $main;
    }
    canvas {
    background-color: whitesmoke;
    display: block;
    margin: auto;
  }

  .controls {
    text-align: center;
    margin-top: 10px;
  }

  .score {
    text-align: center;
    font-size: 24px;
    color: white;
  }
</style>
