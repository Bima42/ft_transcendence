<template>
  <section :class="props.position">
    <h1 v-if="props.position === 'main'">Main Menu</h1>
    <section class="selections">
      <router-link to="/live">
        <h2>Watch a live game</h2>
      </router-link>
      <router-link to="/play">
        <h2>Play a game</h2>
      </router-link>
      <router-link to="/score">
        <h2>Score board</h2>
      </router-link>
      <router-link to="/community">
        <h2>Community</h2>
      </router-link>

    </section>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  position: String,
}>()
</script>

<style scoped lang="scss">
.main {
  grid-area: $main;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;

  h1 {
    font-size: 84px;
    font-family: "Meta", sans-serif;
    font-weight: bold;
    text-shadow: 5px 5px 0px $yellow,
    10px 10px 0px orange,
    15px 15px 0px #e601c0,
    20px 20px 10px #e9019a;
    -webkit-text-stroke: 2px $yellow;
    color: black;

  }

  .selections {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;


    @font-face {
      src: url("https://www.axis-praxis.org/fonts/webfonts/MetaVariableDemo-Set.woff2") format("woff2");
      font-family: "Meta";
      font-style: normal;
      font-weight: normal;
    }

    h2:hover {
      transition: all 0.5s;
      font-variation-settings: "wght" 900, "ital" 1;
      text-align: center;
      text-shadow: 5px 5px 0px black,
      10px 10px 0px orange,
      15px 15px 0px #e601c0,
      20px 20px 10px #e9019a;
      cursor: pointer;
      color: $yellow;
    }

    a {
      text-decoration: none;

      h2 {
        font-family: "Meta", sans-serif;
        transition: all 0.5s;
        font-variation-settings: "wght" 1900, "ital" 0;
        text-shadow: none;
        -webkit-text-stroke: 2px $yellow;
        font-size: 42px;
        color: black;
      }
    }
  }
}
</style>