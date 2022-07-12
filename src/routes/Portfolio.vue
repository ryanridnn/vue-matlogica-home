<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useConnectionStore } from "../store";
import { validateSubmit, useThrottle } from "../utils";
import { updateParam } from "../connection";

import Table from "../components/Table.vue";

const connection = useConnectionStore();

const timeout = ref(null);

const handleUpdate = (e, key) => {
	validateSubmit(e, () => {
		updateParam(0, key, e.target.value);
	});
};

const progress = computed(() => connection.dagNodesProgress[0] || 0);
const status = computed(() => connection.dagNodesStatus[0]);

const progressStyle = computed(() => ({
	width: progress.value * 100 + "%",
}));

const tableMaxHeight = ref(600);

const onResize = (e) => {
	throttle(() => {
		if (e.target.innerWidth >= 992) {
			tableMaxHeight.value = 500;
		} else if (e.target.innerWidth < 992) {
			tableMaxHeight.value = 600;
		}
	}, 100);
};

const throttle = useThrottle();

onMounted(() => {
	window.addEventListener("resize", onResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", onResize);
});
</script>

<template>
	<div class="portfolio">
		<div class="portfolio__top">
			<h2 class="portfolio__heading heading">Portfolio Settings</h2>
			<div class="portfolio__form">
				<label for="numTrades" class="portfolio__label"
					>Num Trades</label
				>
				<input
					type="number"
					class="portfolio__field"
					id="numTrades"
					:value="
						connection.portfolio &&
						connection.portfolio.input_params.NumTrades
					"
					@keydown="(e) => handleUpdate(e, 'NumTrades')"
				/>
				<label for="valDate" class="portfolio__label"
					>Valuation Date</label
				>
				<input
					type="number"
					class="portfolio__field"
					id="valDate"
					:value="
						connection.portfolio &&
						connection.portfolio.input_params.ValDate
					"
					@keydown="(e) => handleUpdate(e, 'ValDate')"
				/>
			</div>
		</div>
		<div class="portfolio__output">
			<h3 class="heading">Kernel Creation</h3>
			<div class="portfolio__progress progress">
				<div class="progress__text">
					{{ progress === 1 ? 100 : (progress * 100).toFixed(2) }}%
					Complete
				</div>
				<div :style="progressStyle" class="progress__bar"></div>
			</div>
		</div>
		<Table
			class="table"
			label="Trades"
			:content="connection.trades"
			:maxHeight="tableMaxHeight"
		/>
	</div>
</template>

<style lang="scss">
.portfolio {
	display: grid;
	gap: 1.5rem 1rem;

	@media screen and (min-width: 992px) {
		grid-template-columns: 2fr 3fr;
		grid-template-rows: 1fr auto;

		.portfolio__output {
			grid-column: 1 / 2;
		}

		.table {
			grid-column: 2 / 3;
			grid-row: 1 / 3;
		}
	}

	@media screen and (min-width: 1200px) {
		grid-template-columns: auto 1fr;
	}

	& > * {
		min-width: 0;
	}

	&__top {
		border: 2px dashed rgb(71 85 105);
		padding: 1rem;
		border-radius: 1rem;

		@media screen and (min-width: 768px) {
			padding: 1.5rem 1rem;
		}
	}

	&__form {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr;
		gap: 0.75rem;
		margin-top: 1.25rem;

		& > * {
			min-width: 0px;
		}

		@media screen and (min-width: 640px) {
			grid-template-columns: 120px 1fr;
			margin-top: 1.5rem;
			gap: 1rem;
		}

		@media screen and (min-width: 768px) {
			grid-template-columns: 144px 1fr;
		}
	}

	&__label {
		font-weight: 500;
		align-self: center;
		font-size: 0.875rem;

		@media screen and (min-width: 768px) {
			font-size: 1rem;
		}
	}

	&__field {
		padding: 0.5rem;
		background: rgb(51 65 85);
		border-radius: 0.25rem;
		color: white;

		&:focus {
			outline: 1px solid rgb(226 232 240);
		}
	}

	&__output {
		// margin-bottom: 2rem;
	}

	h3.heading {
		margin-bottom: 1.25rem;
	}
}
</style>
