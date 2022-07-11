<script setup>
import { defineProps, watch, watchEffect, ref, computed } from "vue";
import { useDebounced } from "../utils";

const rangeInputEl = ref(null);
const valueEl = ref(null);
const rangeInputValue = ref(0.5);

const debouncedSliderInput = useDebounced();

const props = defineProps({
	onInput: Function,
	options: {
		type: Object,
		default: {
			min: 0,
			max: 100,
			step: 1,
		},
	},
	value: Number,
});

const onInput = (e) => {
	rangeInputValue.value = rangeInputEl.value.value;
	debouncedSliderInput(() => props.onInput(e), 100);
};

watchEffect(() => {
	if (valueEl.value) {
		valueEl.value.textContent =
			Number(rangeInputValue.value).toFixed(2) + "%";
	}
});

watchEffect(() => {
	if (valueEl.value) {
		valueEl.value.textContent = Number(props.value).toFixed(2) + "%";
	}
});
</script>

<template>
	<div class="range">
		<div class="range__inner">
			<div class="tooltip tooltip--min">{{ props.options.min }}%</div>
			<!-- <div ref="tooltipContentEl" class="tooltip tooltip--center"></div> -->
			<input
				ref="rangeInputEl"
				type="range"
				:min="props.options.min"
				:max="props.options.max"
				:step="props.options.step"
				:value="props.value"
				@input="onInput"
				class="range__input"
			/>
			<div class="tooltip tooltip--max">{{ props.options.max }}%</div>
		</div>
		<div ref="valueEl" class="range__value">{{}}</div>
	</div>
</template>

<style lang="scss">
.range {
	display: grid;
	grid-template-columns: minmax(auto, 342px) 1fr;
	align-items: center;
	gap: 1rem;

	&__inner {
		position: relative;
	}

	&__value {
		width: 2.5rem;
		max-width: 100%;
		border-radius: 0.25rem;
		padding: 0.25rem 0;
		font-size: 0.875rem;
		text-align: center;
		font-weight: medium;
	}

	.tooltip {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.25rem;
		background: rgb(251, 191, 36);
		color: rgb(15, 23, 42);
		font-weight: 600;
		top: -3.5rem;
		opacity: 0;
		pointer-events: none;
		transition: all 0.2s ease;

		&--min {
			transform: translate(-50%, 20%);
			left: 0;
		}

		&--max {
			transform: translate(50%, 20%);
			right: 0;
		}

		&--center {
			left: 50%;
			width: 4rem;
			height: 2rem;
			top: -3.25rem;
			transform: translate(-50%, 20%);

			&::before {
				display: none;
			}
		}
	}

	.tooltip::before {
		content: "";
		position: absolute;
		height: 0;
		border: 0.5rem solid transparent;
		border-bottom: 0;
		border-top: 0.5rem solid rgb(251, 191, 36);
		bottom: 0;
		transform: translate(0, 100%);
	}

	&:hover .tooltip,
	&:focus .tooltip {
		pointer-events: all;
		opacity: 1;

		&--min {
			transform: translate(-50%, 0);
		}

		&--max {
			transform: translate(50%, 0);
		}

		&--center {
			transform: translate(-50%, 0);
		}
	}

	&__input {
		display: block;
		appearance: none;
		width: min(100%, 342px);
		max-width: 100%;
		height: 0.75rem;
		border-radius: 2rem;
		background: rgb(51, 65, 85);
	}

	&__input::-webkit-slider-thumb {
		appearance: none;
		height: 1.25rem;
		position: relative;
		width: 1.25rem;
		background: white;
		border-radius: 100%;
		position: relative;
	}

	&__input::-webkit-slider-thumb::before {
		position: absolute;
		content: "";
		height: 2rem;
		width: 2rem;
		background: black;
		bottom: 0;
	}

	&__input:active::-webkit-slider-thumb {
		background: rgb(251, 191, 36);
	}

	&__input::-moz-range-thumb {
		appearance: none;
		height: 1.25rem;
		width: 1.25rem;
		background: white;
		border-radius: 100%;
		position: relative;
	}

	&__input:hover::-moz-range-thumb {
		background: rgb(251, 191, 36);
	}
}
</style>
