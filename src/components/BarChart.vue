<script setup>
import { defineProps, ref, computed, watchEffect } from "vue";

import { Bar } from "vue-chartjs";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const chart = ref(null);

const props = defineProps({
	label: String,
	content: Object,
	aspectRatio: {
		type: Number,
		default: 1,
	},
	showTicks: {
		type: Boolean,
		default: true,
	},
});

const chartData = computed(() => {
	return {
		labels: Object.keys(props.content),
		datasets: [
			{
				data: Object.values(props.content),
				backgroundColor: "rgb(217 70 239)",
				borderRadius: 5,
				lineTension: 0.6,
			},
		],
	};
});

const options = {
	responsive: true,
	aspectRatio: props.aspectRatio,
	interaction: {
		intersect: false,
	},
	scales: {
		y: {
			ticks: {
				color: "#bbb",
				display: props.showTicks,
			},
			grid: {
				color: "#2f2f2f",
				display: props.showTicks,
			},
		},
		x: {
			ticks: {
				color: "#bbb",
				display: props.showTicks,
			},
			grid: {
				color: "#2f2f2f",
				display: props.showTicks,
			},
		},
	},
	plugins: {
		title: {
			display: false,
		},
		legend: {
			display: false,
		},
	},
};

watchEffect(() => {
	if (chart.value) {
		chart.value.chart.config.options.aspectRatio = props.aspectRatio;
		// chart.value.upda
	}
});
</script>

<template>
	<div class="bar" v-if="Object.keys(props.content).length > 0">
		<h3 class="heading" v-if="props.label && props.label.length > 0">
			{{ props.label }}
		</h3>
		<Bar ref="chart" :chart-data="chartData" :chart-options="options" />
	</div>
</template>

<style lang="scss">
.bar {
	display: flex;
	flex-direction: column;

	h3.heading {
		margin: 0 0 1.25rem !important;
		align-self: flex-start;
	}
}
</style>
