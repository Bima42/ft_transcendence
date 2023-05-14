<template>
	<section class="otp-wrapper">
		<img alt="42 logo" style="width: 200px; height: 200px" src="@/assets/logo.png">
		<div class="code-container">
			<h4>Enter your code here</h4>
			<input type="text" placeholder="Enter your code here" v-model="code">
			<ButtonCustom @click="toggleCode">Submit</ButtonCustom>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import ButtonCustom from '@/components/buttons/ButtonCustom.vue'

const code = ref('')
const userStore = useUserStore()

const toggleCode = async () => {
		await userStore.verifyTwoFaCode(code.value)
		.catch(e => alert(e.message))
}

</script>

<style scoped></style>
