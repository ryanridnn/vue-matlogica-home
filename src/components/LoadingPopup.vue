<script setup>
import { ref, computed, watchEffect, defineProps } from "vue";
import { useConnectionStore } from "../store";

const props = defineProps({
	show: Boolean,
	closeDelay: {
		type: Number,
		default: 2000,
	},
});

const show = ref(false);
const timeout = ref(null);
const initialShow = ref(false);
const initialShowTimeout = ref(null);

const connection = useConnectionStore();

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

watchEffect(() => {
	clearTimeout(timeout.value);
	if (props.show) {
		if (!initialShow.value) {
			initialShowTimeout.value = setTimeout(
				() => (show.value = true),
				100
			);
		} else {
			if (initialShowTimeout.value) {
				clearTimeout(initialShowTimeout.value);
			}

			show.value = true;
		}
	} else {
		timeout.value = setTimeout(() => {
			show.value = false;
		}, props.closeDelay);
	}
});
</script>

<template>
	<div class="loading-popup" :class="{ 'loading-popup--show': show }">
		<div class="loading-popup__text">
			Loading portfolio with {{ NumTrades }} IR SWAPS...
		</div>
		<div class="loading-popup__progress progress">
			<div class="progress__text">
				{{ progress === 1 ? 100 : (progress * 100).toFixed(2) }}%
				Complete
			</div>
			<div :style="progressStyle" class="progress__bar"></div>
		</div>
	</div>
</template>

<style lang="scss">
.loading-popup {
	top: 2rem;
	position: absolute;
	left: 50%;
	transform: translate(-50%, calc(-100% - 2rem));
	background: rgb(15, 23, 42);
	padding: 1.5rem 1rem;
	border-radius: 0.75rem;
	transition: all 0.4s ease;
	max-width: 90%;
	width: 560px;
	z-index: 100;

	&--show {
		transform: translate(-50%, 0);
	}

	&__text {
		text-align: center;
		margin-bottom: 1rem;
		font-size: 0.875rem;

		@media screen and (min-width: 640px) {
			font-size: 1rem;
		}
	}
}
</style>
