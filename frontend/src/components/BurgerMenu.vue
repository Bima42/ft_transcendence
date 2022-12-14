<template>
  <div class="header-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <path fill="white"
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    <input id="menu-toggle" type="checkbox"/>
    <label for="menu-toggle">
      <BurgerButton></BurgerButton>
    </label>
    <ul class="menu">
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
      <li>Four</li>
      <li>Five</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import BurgerButton from "@/components/BurgerButton.vue";

const props = defineProps<{}>()
</script>

<style scoped lang="scss">
.header-wrapper {
  grid-area: header3;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  width: 100%;
  overflow: hidden;
  svg {
    min-width: 25%;
  }
}

.menu {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;

  position: absolute;

  list-style-type: none;
  padding: 0;
  top: 30px;
  right: 20px;
  margin-top: 50px;
  width: 100%;
}

.menu > li {
  margin: 0 1rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 0.6em 0;
  color: white;
  min-width: 10em;
  background-color: #222;
}

#menu-toggle {
  display: none;
}

#menu-toggle ~ .menu li {
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
}

#menu-toggle:checked ~ .menu li {
  border: 1px solid $yellow;
  height: 2.5em;
  padding: 0.5em;
  transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
}
</style>