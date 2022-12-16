<template>
  <button><span class="menu-btn_burger"></span></button>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
button {
  width: 60px;
  height: 60px;
  border: none;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: $yellow;
  border-radius: 50%;
  margin-left: 83.4px;
  font-size: 28pt;
  transition: all 200ms ease-in-out;

  &:hover {
    cursor: pointer;
    transform: scale(0.9);
    transition: all 200ms ease-in-out;
  }

  .menu-btn_burger::before,
  .menu-btn_burger::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 4px;
    background: black;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(255, 101, 47, .2);
    transition: all .5s ease-in-out;
  }

  .menu-btn_burger::before {
    transform: rotate(-45deg) translate(-10px, -10px);
  }

  .menu-btn_burger::after {
    transform: rotate(45deg) translate(-10px, 10px);
  }
}
</style>