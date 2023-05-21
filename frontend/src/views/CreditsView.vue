<template>
	<section class="credit_wrapper">
		<section class="editors">
			<GitHubCard :link="creator.githubLink" v-for="(creator, i) in creators" :key="i" :id="creator.name">
				<h2>{{ creator.name }}</h2>
				<p class="quote">{{ "~ " + creator.title }}</p>
			</GitHubCard>
		</section>
		<section class="back_button">
			<ButtonCustom :style="'big'" :click="() => $router.push('/')">
				Back
			</ButtonCustom>
		</section>
	</section>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import GitHubCard from '@/components/footers/GitHubCard.vue'
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';

const creators = ref(
	[
		{
			name: 'Bima42',
			title: 'BackMan',
			githubLink: 'https://github.com/Bima42',
			website: ''
		},
		{
			name: 'YvanoffP',
			title: 'FrontMan',
			githubLink: 'https://github.com/YvanoffP',
			website: ''
		},
		{
			name: 'Tyrossel',
			title: 'GeniusMan',
			githubLink: 'https://github.com/Tyrossel',
			website: ''
		},
	]
)
</script>

<style scoped lang="scss">
.credit_wrapper {
	grid-area: $gigamain;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	height: 100%;

	.editors {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: center;
		gap: 50px;
	}

	.back_button {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>