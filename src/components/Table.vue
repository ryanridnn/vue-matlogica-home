<script setup>
import { defineProps, computed } from "vue ";

const props = defineProps({
	label: String,
	content: [Array, Object],
	maxHeight: {
		type: Number,
		default: 600,
	},
	options: {
		type: Object,
		default: {
			keyAndValue: false,
			headings: [],
		},
	},
});

const tableHeadings = computed(() => {
	if (props.options.keyAndValue) {
		return props.options.headings;
	} else {
		return !props.content || props.content.length === 0
			? []
			: Object.keys(props.content[0]);
	}
});
</script>

<template>
	<div
		v-if="props.content && Object.keys(props.content).length > 0"
		class="table"
	>
		<h3 class="heading">{{ props.label }}</h3>
		<div class="table__inner">
			<div
				class="table__wrapper"
				:style="{ 'max-height': props.maxHeight + 'px' }"
			>
				<table class="table__element">
					<tr class="table__row table__row-heading">
						<th
							v-for="heading in tableHeadings"
							:key="heading"
							class="table__heading"
						>
							{{ heading }}
						</th>
					</tr>
					<template v-if="props.options.keyAndValue">
						<tr
							v-for="key in Object.keys(props.content)"
							class="table__row"
						>
							<td class="table__data">{{ key }}</td>
							<td class="table__data">
								{{ props.content[key] }}
							</td>
						</tr>
					</template>
					<template v-else>
						<tr v-for="data in props.content" class="table__row">
							<td
								v-for="key in Object.keys(data)"
								class="table__data"
							>
								{{ data[key] }}
							</td>
						</tr>
					</template>
				</table>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.table {
	display: flex;
	flex-direction: column;

	&__wrapper {
		overflow: auto;
		border-radius: 0.75rem;
		position: relative;
		margin-top: 0.125rem;

		&::-webkit-scrollbar {
			width: 10px;
			height: 10px;
		}

		/* Track */
		&::-webkit-scrollbar-track {
			background: rgb(100 116 139);
			border-radius: 2rem;
		}

		/* Handle */
		&::-webkit-scrollbar-thumb {
			background: rgb(251, 191, 36);
			border-radius: 2rem;
		}

		/* Handle on hover */
		&::-webkit-scrollbar-thumb:hover {
			background: rgb(252 211 77);
		}
	}

	&__element {
		width: 100%;
		color: #222;
		font-size: 0.75rem;

		@media screen and (min-width: 640px) {
			font-size: 0.875rem;
		}
		// table-layout: fixed;
	}

	&__row {
		width: 100%;
	}

	&__row-heading {
		top: 0;
		position: sticky;
	}

	&__heading {
		padding: 0.75rem !important;
	}

	&__data {
		padding: 0.625rem !important;
	}

	&__heading,
	&__data {
		flex: 1;
		border: 0.5px solid rgb(51 65 85);
	}

	&__heading {
		font-weight: 500;
		background: rgb(37, 99, 235) !important;
		color: white;
	}

	&__data {
		// background: rgb(30 41 59);
		color: white;
	}

	h3.heading {
		margin: 0 0 1rem !important;
		align-self: flex-start;
	}
}
</style>
