<template>
	<div class="stat_circle">
		<div class="outer">
			<div class="inner">
				<span class="value">{{props.text}}</span>
			</div>
		</div>
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
			<defs>
				<linearGradient id="GradientColor">
					<stop offset="0%" stop-color="#00ADB5" />
					<stop offset="100%" stop-color="#EEEEEE" />
				</linearGradient>
			</defs>
			<circle cx="80" cy="80" r="70" stroke-linecap="round"
					:style="{ '--dash-offset': `${strokeDashoffset}` }"
					:stroke-dasharray="dashArray"
					:stroke-dashoffset="dashOffset"
					transform="rotate(-90 80 80)"
			/>
		</svg>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	stats: number | null,
	text: string | null
}>()

const percentage = computed(() => {
	if (props.stats === null) return 0
	return Math.round(props.stats)
})

const dashArray = computed(() => {
	return 2 * Math.PI * 70
})

const dashOffset = computed(() => {
	return 2 * Math.PI * 70
})

const strokeDashoffset = computed(() => {
	return dashArray.value - dashOffset.value * ( percentage.value / 100 )
})

</script>

<style scoped lang="scss">
.stat_circle {
	width: 160px;
	height: 160px;
	position: relative;

	.outer {
		width: 160px;
		height: 160px;
		padding: 20px;
		border-radius: 50%;
		box-shadow: 6px 6px 10px -1px rgba(0,0,0,0.15);
	}

	.inner {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: inset 4px 4px 6px -1px rgba(0,0,0,0.15);
	}

	.value {
		font-family: 'Martian Mono', serif;
		font-size: 16px;
		font-weight: 700;
	}

	circle {
		fill: none;
		stroke: url(#GradientColor);
		stroke-width: 20px;
		animation: anim 2s linear forwards;
	}

	@keyframes anim {
		100% {
			stroke-dashoffset: var(--dash-offset);
		}
	}

	svg {
		position: absolute;
		top: 0;
		left: 0;
	}
}

</style>