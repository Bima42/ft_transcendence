<template>
<div>
	<ul class="tabs__header">
		<li v-for="tab in tabs" :key="tab.title">{{ tab.title }}</li>

	</ul>
	<slot></slot>
</div>

</template>

<script setup lang="ts">

</script>

<script lang="ts">
export default {

    data () {
      return {
        selectedIndex: 0, // the index of the selected tab,
        tabs: [] // all of the tabs
      }
    },
	created () {
		this.tabs = this.$children
	}

//   methods: {
//       selectTab (i) {
//         this.selectedIndex = i

//         // loop over all the tabs
//         this.tabs.forEach((tab, index) => {
//           tab.isActive = (index === i)
//         })
//       }
//    }
}
</script>

