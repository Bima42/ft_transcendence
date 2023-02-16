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
    var x = canvas.width;
    var y = canvas.height/2;
    var dx = -3;
    var dy = -4;
    var dirx = 0;
    var diry = 0;
    var paddleHeight = 100;
    var paddleWidth = 20;
    var paddleLeftY = canvas.height/2;
    var paddleRightY = canvas.height/2;

    // dessin et mouvement de la balle
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI*2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        if ((x > (canvas.width / canvas.width)) && dirx == 0)
        {
            x += dx;
        }
        else if (x < canvas.width -1)
        {
            dirx = 1;
            x -= dx;
        }
        else
            dirx = 0;

        if ((y > (canvas.height / canvas.height)) && diry == 0)
        {
            y += dy;
        }
        else if (y < 599)
        {
            diry = 1;
            y -= dy;
        }
        else
            diry = 0;
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

    // fonction principale
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawMiddleLine();
        drawPaddleLeft();
        drawpaddleRight();
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

    // boucle affichage
    setInterval(draw, 10);
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
