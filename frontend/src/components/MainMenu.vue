<template>
  <section :class="props.position">
    <h1 v-if="props.position === 'main'">Main Menu</h1>
    <section class="selections">
      <router-link v-for="item in items" :to="item.link">
        <h2 :id="item.id">{{ item.name }}</h2>
      </router-link>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  position: String,
}>()

const items = ref(
    [
      {
        name: 'Watch a live game',
        link: '/live',
        id: 'live',
      },
      {
        name: 'Play a game',
        link: '/play',
        id: 'play',
      },
      {
        name: 'Score board',
        link: '/score',
        id: 'score',
      },
      {
        name: 'Community',
        link: '/community',
        id: 'community',
      },
    ]
)

onMounted(() => {
  if (router.currentRoute.value.name !== 'index') {
    let current_selection = document.getElementById(router.currentRoute.value.name)
    current_selection.classList.add('selected')
  }
})

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

    .selected {
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

    h2:hover {
      transform: translateX(10px);
    }

    a {
      text-decoration: none;

      h2 {
        font-family: "Meta", sans-serif;
        transition: all 0.5s;
        font-variation-settings: "wght" 1900, "ital" 0;
        text-shadow: none;
        -webkit-text-stroke: 2px $yellow;
        font-size: 24px;
        color: black;
      }
    }
  }
}
</style>