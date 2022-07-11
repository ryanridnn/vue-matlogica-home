<script setup>
import { ref, computed, watchEffect, onMounted, onUnmounted } from "vue";
import { useConnectionStore } from "../store";
import { useThrottle } from "../utils";

import LineChart from "../components/LineChart.vue";
import BarChart from "../components/BarChart.vue";

const connection = useConnectionStore();

const priceAndRisk = computed(() => connection.dagNodes[1]);
const portfolio = computed(() => connection.dagNodes[0]);

const marketRates = computed(() => {
	if (
		priceAndRisk.value &&
		portfolio.value &&
		priceAndRisk.value.output_params.MarketRates &&
		portfolio.value.output_params.OriginalMarketRates
	) {
		let currentMarketRates = {};
		let originalMarketRates = {};

		priceAndRisk.value.output_params.MarketRates.map((arr) => {
			currentMarketRates[arr[0]] = arr[1];
		});

		portfolio.value.output_params.OriginalMarketRates.map((arr) => {
			originalMarketRates[arr[0]] = arr[1];
		});

		return [currentMarketRates, originalMarketRates];
	} else {
		return [];
	}
});

const fittedValues = computed(() => {
	if (
		priceAndRisk.value &&
		priceAndRisk.value.output_params.fitted_values_forecast &&
		priceAndRisk.value.output_params.fitted_values_discount
	) {
		return [
			priceAndRisk.value.output_params.fitted_values_forecast,
			priceAndRisk.value.output_params.fitted_values_discount,
		];
	} else {
		return [];
	}
});

const risk = computed(() => {
	let risk = {};

	if (priceAndRisk.value && priceAndRisk.value.output_params.Risk) {
		priceAndRisk.value.output_params.Risk.map((arr) => {
			risk[arr[0]] = arr[1];
		});
		return risk;
	} else {
		return risk;
	}

	return (
		(priceAndRisk.value ? priceAndRisk.value.output_params.Risk : []) || []
	);
});

const NumTrades = computed(() => {
	if (connection.dagNodes[0]) {
		return connection.dagNodes[0].input_params.NumTrades;
	} else {
		return "";
	}
});

const progress = computed(() => connection.initialLoadProgress || 0);

const progressStyle = computed(() => ({
	width: progress.value * 100 + "%",
}));

const portfolioNPV = computed(
	() =>
		(priceAndRisk.value
			? priceAndRisk.value.output_params.PortfolioNPV
			: 0) || 0
);

const currentValuationTime = computed(
	() =>
		(priceAndRisk.value ? priceAndRisk.value.output_params.CalcTime : 0) ||
		0
);

const irSwaps = computed(
	() => (portfolio.value ? portfolio.value.input_params.NumTrades : 0) || 0
);

const portfolioLoadTime = computed(
	() => (portfolio.value ? portfolio.value.output_params.CalcTime : 0) || 0
);

const widget = ref(null);

const throttle = useThrottle();

const readonliesStyle = ref({ "grid-template-columns": "1fr" });
const graphsStyle = ref({
	"grid-template-columns": "1fr",
});

const showMarketGraph = ref(false);
const showFittedGraph = ref(false);
const showRiskGraph = ref(false);

const handleSizing = (width) => {
	// for readonlies

	if (width >= 448) {
		readonliesStyle.value = {
			"grid-template-columns": "1fr 1fr",
			gap: ".5rem 1rem",
		};
	} else {
		readonliesStyle.value = {
			"grid-template-columns": "1fr",
			gap: ".5rem",
		};
	}

	// for graphs

	if (width >= 448) {
		showMarketGraph.value = true;
		showFittedGraph.value = true;
		showRiskGraph.value = true;

		graphsStyle.value = {
			display: "grid",
			"grid-template-columns": "1fr 1fr 1fr",
		};
	} else if (width >= 352) {
		showMarketGraph.value = true;
		showFittedGraph.value = false;
		showRiskGraph.value = false;
		graphsStyle.value = {
			display: "grid",
			"grid-template-columns": "1fr",
		};
	} else {
		showMarketGraph.value = false;
		showFittedGraph.value = false;
		showRiskGraph.value = false;
		graphsStyle.value = {
			display: "none",
		};
	}
};

const onResize = (e) => {
	throttle(() => {
		handleSizing(widget.value.clientWidth);
	}, 100);
};

onMounted(() => {
	handleSizing(window.innerWidth);
	window.addEventListener("resize", onResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", onResize);
});
</script>

<template>
	<div ref="widget" class="widget">
		<div
			class="widget__top"
			:class="{ 'widget__top--completed': progress === 1 }"
		>
			<div class="top__text">
				<template v-if="progress === 1">
					Complete Loading portfolio with {{ NumTrades }} IR SWAPS
				</template>
				<template v-else>
					Loading portfolio with {{ NumTrades }} IR SWAPS...
				</template>
			</div>
			<div class="portfolio__progress progress">
				<div class="progress__text">
					{{ progress === 1 ? 100 : (progress * 100).toFixed(2) }}%
					Complete
				</div>
				<div :style="progressStyle" class="progress__bar"></div>
			</div>
		</div>
		<div class="widget__readonlies" :style="readonliesStyle">
			<div class="widget__readonly readonly">
				<div class="readonly__label">PortfolioNPV</div>
				<div class="readonly__value">
					{{ portfolioNPV.toFixed(2) }}
				</div>
			</div>
			<div class="widget__readonly readonly widget__readonly--small">
				<div class="readonly__label">IR SWAPS</div>
				<div class="readonly__value">
					{{ irSwaps }}
				</div>
			</div>
			<div class="widget__readonly readonly">
				<div class="readonly__label">Current valuation time</div>
				<div class="readonly__value">
					{{ currentValuationTime.toFixed(2) }}ms
				</div>
			</div>
			<div class="widget__readonly readonly">
				<div class="readonly__label">Portfolio Load Time</div>
				<div class="readonly__value">
					{{ portfolioLoadTime.toFixed(2) }}ms
				</div>
			</div>
		</div>
		<div class="widget__graphs" :style="graphsStyle">
			<div class="widget__graph" v-if="showMarketGraph">
				<LineChart
					class="widget__chart line--market"
					:content="marketRates"
					:colors="['rgb(52 211 153)', 'rgb(148 163 184)']"
					:showTicks="false"
					:options="{ showLabel: false }"
				/>
			</div>
			<div class="widget__graph" v-if="showFittedGraph">
				<LineChart
					class="widget__chart line--fitted"
					:content="fittedValues"
					:showTicks="false"
					:options="{ showLabel: false }"
				/>
			</div>
			<div class="widget__graph" v-if="showRiskGraph">
				<BarChart
					class="widget__chart bar--risk"
					:content="risk"
					:showTicks="false"
				/>
			</div>
		</div>
		<button
			type="button"
			class="btn__modal"
			data-bs-toggle="modal"
			data-bs-target="#live-server-modal"
			:disabled="progress !== 1"
		>
			Launch The Live Risk App
		</button>
	</div>
</template>

<style lang="scss">
.widget {
	background-color: rgb(30 41 59);
	border-radius: 2rem;
	padding: 1.5rem;
	color: #f5f5f5;
	width: 100%;
	max-width: 640px;
	display: flex;
	gap: 1rem;
	flex-direction: column;

	&__top {
		transition: all 0.25s ease;
		overflow: hidden;

		&--completed {
			display: none;
		}

		.top__text {
			text-align: center;
			font-size: 0.875rem;
			line-height: 1.5rem;
			width: 100%;

			@media screen and (min-width: 640px) {
				font-size: 1rem;
			}
		}
	}

	&__readonlies {
		display: grid;
		grid-template-columns: 1fr;
		border-radius: 1rem;
		font-size: 0.75rem;
		justify-content: start;

		& > * {
			min-width: 0;
		}
	}

	&__graphs {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
		& > * {
			min-width: 0;
		}
	}

	&__graph {
		width: 100%;
		min-height: 5rem;
		background: rgb(15 23 42);
		padding: 0.75rem;
		border-radius: 0.5rem;

		&--hidden {
			display: none;
		}
	}

	.btn__modal {
		background: rgb(51, 65, 85);
		padding: 0.75rem;
		border-radius: 0.5rem;
		font-weight: 600;
		color: #f5f5f5;
		width: 100%;
		line-height: 1.5;
		font-size: 0.75rem;

		@media screen and (min-width: 640px) {
			font-size: 0.875rem;
		}

		&:disabled {
			color: #bbb;
		}
	}
}

.top__text {
	margin-bottom: 1rem !important;
}
</style>
