<template>
	<div id="wrapper">
	<GameSettings></GameSettings>
	<CustomButton id="join_btn">Join queue</CustomButton>
	</div>
</template>

<script setup lang="ts">

import CustomButton from '@/components/CustomButton.vue'
import GameSettings from '@/components/game/GameSettings.vue';


</script>

<style scoped lang="scss">
	div {
		padding: 26px;

	}
#wrapper {
  display: flex;
  justify-content: center;
}

#join_btn {
	font-size: 20px;
}

</style>
