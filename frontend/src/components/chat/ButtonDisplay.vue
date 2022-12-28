<template>
	<div>
		<button @click="isShow = !isShow">Private Channels</button>
		<div v-if="isShow">
			<p v-on:click="showContent = !showContent" class="text">Chat 1</p>
			<p v-if="showContent" class="content">This is the discussion that will be displayed when the chat is clicked</p>
		</div>
	</div>
	<div>
		<button @click="isShow2 = !isShow2">General Channels</button>
		<div v-if="isShow2">
			<p v-on:click="showContent2 = !showContent2" class="text">Chat 1</p>
			<p v-if="showContent2" class="content">This is the discussion that will be displayed when the chat is clicked</p>
		</div>
	</div>
</template>

<script lang="ts">
import ChatMessageDisplay from './ChatMessageDisplay.vue';

export default {
	name: "Display",
	data: function () {
	return {
		isShow: false,
		isShow2: false,
		showContent: false,
		showContent2: false,
	};
},

  props: {
    msg: String,
  },
};
</script>

<style scoped lang="scss">
button {
	width : 150px;
	background: $yellow;
	padding: 5px 12px;
	border: 10px;
	border-color: black;
	margin-bottom: 2px;

	&:hover {
		cursor: pointer;
		filter: hue-rotate(180deg);
	}

	&.fat {
		font-weight: 900;
	}
}
.text {
  color: yellow;
  cursor: pointer;
  &:hover {
    color: pink;
  }
}

.content {
  color: rgb(255, 191, 0);
  background-color: rgb(36, 34, 34);
  padding: 20px;
  box-shadow: 0 10px 20px rgba(179, 1, 182, 0.19), 0 6px 6px rgba(137, 0, 144, 0.23);
}
</style>
