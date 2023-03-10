<template>

<div id="wrapper">

    <GameSettings></GameSettings>
    <CustomButton id="join_btn" @click="joinQueue">Join queue</CustomButton>
	<p v-if="joinText" class="join-text">{{ joinText }}</p>
	<div class="box" v-if="showBox">
		<ball></ball>
	</div>
</div>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import CustomButton from '@/components/CustomButton.vue';
import GameSettings from '@/components/game/GameSettings.vue';

const joinText = ref('');
const showBox = ref(false);

function joinQueue() {
	joinText.value = 'You have successfully joined the queue. Please wait for a few seconds while we find you a match.';
    showBox.value = true;
}

</script>

<style scoped lang="scss">

  .join-text {
    color: $yellow;
	text-align: center;
  	margin: 10px 0 30px;
  }

  #wrapper {
    display: flex;
    flex-direction: column;
	justify-content: center;
	width: 50%;
	grid-area: $main;
  }

  #join_btn {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .box {
	display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    height: 30px;
    position: relative;
    border-left: 3px solid $yellow;
    border-right: 3px solid $yellow;
  }

  .box ball {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: $yellow;
    position: absolute;
    -webkit-animation: moveX 2.00s linear 0s infinite alternate;
  }

  @-webkit-keyframes moveX {
    from { left: 0; } to { left: 98%; }
  }

</style>