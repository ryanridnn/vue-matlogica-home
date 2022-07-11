<script setup>
import { defineProps, ref, computed, watchEffect } from "vue";

import { Line } from "vue-chartjs";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const props = defineProps({
	label: String,
	content: Array,
	options: {
		type: Object,
		default: {
			showLabel: false,
			labels: [],
		},
	},
	colors: {
		type: Array,
		default: ["rgb(52 211 153)", "rgb(217 70 239)"],
	},
	aspectRatio: {
		type: Number,
		default: 1,
	},
	showTicks: {
		type: Boolean,
		default: true,
	},
});

const chart = ref(null);

const chartData = computed(() => {
	return {
		labels: Object.keys(props.content[0]),
		datasets: props.content.map((cont, index) => {
			return {
				label: props.options.labels
					? props.options.labels[index]
					: index,
				data: Object.values(cont),
				borderColor: props.colors[index % props.colors.length],
				lineTension: 0.2,
				pointRadius: 2,
			};
		}),
	};
});

const options = {
	responsive: true,
	aspectRatio: props.aspectRatio,
	interaction: {
		intersect: false,
		mode: "index",
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
			position: "bottom",
			display: props.options.showLabel,
			labels: {
				color: "#ddd",
			},
			boxHeight: 200,
		},
	},
};

watchEffect(() => {
	if (chart.value) {
		chart.value.chart.config.options.aspectRatio = props.aspectRatio;
	}
});
</script>

<template>
	<div class="line" v-if="Object.keys(props.content).length > 0">
		<h3 class="heading" v-if="props.label && props.label.length > 0">
			{{ props.label }}
		</h3>
		<Line ref="chart" :chart-data="chartData" :chart-options="options" />
	</div>
</template>

<style lang="scss">
.line {
	display: flex;
	flex-direction: column;

	h3.heading {
		margin: 0 0 1.25rem !important;
		align-self: flex-start;
	}
}
</style>
