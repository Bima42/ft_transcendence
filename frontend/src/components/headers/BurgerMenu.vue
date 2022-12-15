<template>
  <div class="header-wrapper">
    <img src="@/assets/img/logo.svg"/>
<!--    TODO: Use user avatar here-->
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
import BurgerButton from "@/components/headers/BurgerButton.vue";

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
  img {
    max-width: 50px;
    min-width: 20px;
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