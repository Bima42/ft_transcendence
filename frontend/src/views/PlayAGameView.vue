<template>
<div id="menuList">
<h1 class="mainTitle">Play a game</h1>
<CustomButton>Random match</CustomButton>
<CustomButton>Lobby</CustomButton>
<CustomButton>Create Match</CustomButton>
</div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue';
</script>

<style scoped lang="scss">

.mainTitle {
	font-size: 24px;
	margin-bottom: 20px;

}

#menuList {
  grid-area: $main;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

</style>
