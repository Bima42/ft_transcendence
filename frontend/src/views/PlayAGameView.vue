<template>
    <section class="test">
        <div>
            <canvas id="game" width="800" height="600"></canvas>            
            <!-- <div class="controls">
                <button @click="startGame">Start</button>
                <button @click="pauseGame">Pause</button>
            </div>
            <div class="score">
                Player 1: {{ score1 }} Player 2: {{ score2 }}
            </div> -->
        </div>
    </section>
</template>

<script lang="js">

export default {
  name: 'my-canvas',
  mounted() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    var x = canvas.width;
    var y = canvas.height/2;
    var dx = -3;
    var dy = -4;
    var dirx = 0;
    var diry = 0;
    var paddleLeftY = canvas.height/2;
    var paddleRightY = canvas.height/2;


    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI*2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
    
    function drawMiddleLine() {
        ctx.fillRect(canvas.width/2 ,0,5,600);
    }
    
    function drawPaddleLeft(){
        ctx.fillRect(20 ,paddleLeftY - 55 ,20,110);
    }

    function drawpaddleRight(){
        ctx.fillRect(760 ,paddleRightY - 55 , 20,110);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawMiddleLine();
        drawPaddleLeft();
        drawpaddleRight();
    
        if ((x > (canvas.width / canvas.width)) && dirx == 0)
        {
            x += dx;
        }
        else if (x < 799)
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

    setInterval(draw, 12);
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
