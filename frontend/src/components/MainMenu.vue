<template>
  <section :class="menuPosition">
    <h1 v-if="menuPosition === 'main'">Main Menu</h1>
    <section v-if="routes" class="selections">
      <router-link v-for="item in routes"
                   :to="{ name: item.name }"
                   :id="item.name">
        {{ item.longName }}
      </router-link>
    </section>
  </section>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'

const router = useRouter()
const route = useRoute()

const menuPosition = computed(() => {
  return route.name === 'index' ? 'main' : 'left'
})

const routes = computed(() => menuItems())

function menuItems() {
  let allRoutes = router.options.routes;
  let mainChildren = allRoutes.filter(route => route.name === 'main');
  if (!mainChildren.length) {
    console.error('MainMenu.vue: allRoutes filter has failed to find his main children')
    return []
  }
  return mainChildren[0].children
}
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
    text-align: center;
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
    a {
      text-decoration: none;
      font-family: "Meta", sans-serif;
      transition: all 0.5s;
      font-variation-settings: "wght" 1900, "ital" 0;
      text-shadow: none;
      -webkit-text-stroke: 2px $yellow;
      font-size: 42px;
      color: black;

      &:hover {
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
    }
  }
}

.left {
  grid-area: left1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  height: 100%;
  width: 100%;

  .selections {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    gap: 40px;
    width: 100%;
    height: 100%;
    padding: 40px;
    overflow: hidden;

    .router-link-active {
      transform: translateX(10px);

      &:before {
        content: '';
        position: absolute;
        height: 100%;
        width: 3px;
        background: $yellow;
        border-radius: 25px;
        transition: all .5s ease-in-out;
        left: -20px;
      }
    }

    @font-face {
      src: url("https://www.axis-praxis.org/fonts/webfonts/MetaVariableDemo-Set.woff2") format("woff2");
      font-family: "Meta";
      font-style: normal;
      font-weight: normal;
    }

    a {
      text-decoration: none;
      font-family: "Meta", sans-serif;
      transition: all 0.2s;
      font-variation-settings: "wght" 1900, "ital" 0;
      text-shadow: none;
      -webkit-text-stroke: 2px $yellow;
      font-size: 24px;
      color: black;

      &:hover {
        transform: translateX(10px);
      }
    }
  }
}
</style>
