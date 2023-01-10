<template>
    <section class="test">
        <div>
            <canvas id="game" width="800" height="600"></canvas>            
            <div class="controls">
                <button @click="startGame">Start</button>
                <button @click="pauseGame">Pause</button>
            </div>
            <div class="score">
                Player 1: {{ score1 }} Player 2: {{ score2 }}
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    export default {
    data() {
        return {
        score1: 0,
        score2: 0,
        }
    },
    mounted() {
        this.startGame();
    },
    methods: {
        startGame() {
            game.start();
        },
        pauseGame() {
            game.pause();
        }
    }
}

</script>

<style scoped lang="scss">
    .test {
        grid-area: $main;
    }
    canvas {
    background-color: rgb(211, 59, 160);
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
