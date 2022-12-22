<template>
	<div v-show="this.isActive">
	  <slot></slot>
	</div>
</template>


<script lang="ts">
	export default {
	  props: {
		title: {
		  type: String,
		  default: 'Tab'
		}
	  },
	  data () {
		return {
		  isActive: true
		}
	  }
	}
  </script>


