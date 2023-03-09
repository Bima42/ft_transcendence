<template>
	<div>
	<CustomButton id="classic_btn" class="enabled_button" @click="classic_click">Classic 1972 game</CustomButton>
	<CustomButton id="custom_btn" class="disabled_button" @click="custom_click">Hardcore game</CustomButton>
	</div>
</template>

<script setup lang="ts">

import CustomButton from '@/components/CustomButton.vue';

  const classic_click = () => {
	document.querySelector("#custom_btn").className = "disabled_button";
	document.querySelector("#classic_btn").className = "enabled_button";
    console.log("Classic !");
  }

  const custom_click = () => {
	document.querySelector("#custom_btn").className = "enabled_button";
	document.querySelector("#classic_btn").className = "disabled_button";
    console.log("Custom !");
  }
</script>

<style scoped lang="scss">
button {
  border-radius: 16px;
  background: $yellow;
  padding: 5px 12px;
  border: none;

  &:hover {
    cursor: pointer;
    filter: hue-rotate(180deg);
  }

  &.fat {
    font-weight: 900;
  }

}
  .enabled_button {
	  background-color: $yellow;

  }

  .disabled_button {
	  background-color: $lighter-gray;
	  color: white;

  }
</style>
