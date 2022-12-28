<template>
	<div>
		<button @click="isShow = !isShow">Private Channels</button>
		<div v-if="isShow">- Friend chat 1</div>
	</div>
	<div>
		<button @click="isShow2 = !isShow2">General Channels</button>
		<div v-if="isShow2">- Users ... chat</div>
	</div>
</template>

<script lang="ts">
export default {
  name: "ToggleDiv",
  data: function () {
    return {
      isShow: false,
	  isShow2: false,
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
</style>
