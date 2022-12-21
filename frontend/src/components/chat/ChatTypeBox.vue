<template>
	<div class="chat-input-container">
		<input type="text" placeholder="Type a message..." class="chat-input">
		<CustomButton>Send</CustomButton>
	</div>
</template>


<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'
</script>

<style scoped lang="scss">

#chat .chat-input-container {
	position: relative;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	border-top: 1px solid rgb(255, 221, 1);
	padding: 10px;
  }

  #chat .chat-input {
	flex: 1;
	height: 30px;
	border: 1px solid yellow;
	background-color: rgb(49, 49, 47);
	border-radius: 5px;
	padding: 0 10px;
	margin-right: 5px;
  }

</style>
