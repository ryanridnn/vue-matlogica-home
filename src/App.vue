<script setup>
import { ref, computed, onMounted } from "vue";
import { useConnectionStore } from "./store";
import { useConnection } from "./connection/";
import { CONNECTION_URL, MENUS } from "./constants";

import LoadingPopup from "./components/LoadingPopup.vue";
import Widget from "./components/Widget.vue";
import Dashboard from "./routes/Dashboard.vue";
import Portfolio from "./routes/Portfolio.vue";

const connection = useConnectionStore();

const currentMenu = ref(MENUS.DASHBOARD);

const isLoaded = computed(() => {
	if (connection.loadComplete) {
		return true;
	} else {
		return false;
	}
});

onMounted(() => {
	useConnection(CONNECTION_URL);
});

const selectMenu = (menu) => {
	currentMenu.value = menu;
};
</script>

<template>
	<div class="inner">
		<Widget />

		<div
			class="modal fade"
			id="live-server-modal"
			tabindex="-1"
			aria-labelledby="liveServerModal"
			aria-hidden="true"
		>
			<div class="modal-dialog modal-xl modal-fullscreen-md-down">
				<div class="modal-content">
					<div class="modal-header">
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					<div class="modal-body">
						<div class="wrapper">
							<div v-if="isLoaded" class="main">
								<div class="main__tabs">
									<button
										v-for="menu in Object.keys(MENUS)"
										@click="selectMenu(MENUS[menu])"
										class="main__tab"
										:class="{
											'main__tab--active':
												MENUS[menu] === currentMenu,
										}"
									>
										{{ MENUS[menu] }}
									</button>
								</div>

								<div class="main__view">
									<Dashboard
										v-if="currentMenu === MENUS.DASHBOARD"
									/>
									<Portfolio
										v-if="currentMenu === MENUS.PORTFOLIO"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.inner {
	display: flex;
	justify-content: center;
	align-items: center;
	line-height: 1;

	&,
	& * {
		font-family: "Inter", sans-serif;
	}

	& h1,
	& h2,
	& h3 {
		color: #f5f5f5;
	}

	& h2 {
		font-size: 1.25rem !important;
		font-weight: 600 !important;

		@media screen and (min-width: 768px) {
			font-size: 1.5rem !important;
		}
	}

	& h3 {
		font-size: 1rem !important;
		font-weight: 600 !important;

		@media screen and (min-width: 768px) {
			font-size: 1.125rem !important;
		}
	}

	@media screen and (min-width: 768px) {
		.modal-dialog {
			overflow: hidden;
			border-radius: 2rem;
		}

		.modal-dialog {
			max-width: 1300px !important;
			width: 95%;
			margin: 1.25rem auto;
		}
	}

	.modal-content {
		background-color: rgb(30 41 59);
	}

	.modal-header {
		border-bottom: 0;
		padding: 0.5rem 1rem;

		.btn-close {
			background: none;
			color: white;
			margin-right: 0.5rem;
			height: 1.75rem;

			svg {
				height: 100%;
				font-weight: 600;
			}
		}
	}

	.modal-body {
		padding: 0 1rem 1rem;
	}
}

.wrapper {
	margin: 0 auto;
	min-height: 500px;
	padding: 0.75rem 0 1rem;

	position: relative;
	background: rgb(15 23 42);

	color: #f5f5f5;

	overflow: hidden;
	line-height: 1;
	border-radius: 2rem;
	overflow: hidden;
}

.main {
	&__tabs {
		display: flex;
		align-items: center;
		margin: 0 auto;
		width: fit-content;
		padding: 0.375rem;
		border-radius: 0.5rem;
		background: rgb(51 65 85);
	}

	&__tab {
		padding: 0.5rem 0.75rem;
		color: white;
		border-radius: 0.25rem;
		font-size: 1rem;

		&--active {
			background: rgba(251, 191, 36, 1);
			color: rgb(30 41 59);
			font-weight: 500;
		}
	}

	&__view {
		background: rgb(15 23 42);
		padding: 0 1rem;
		border-radius: 1rem;
		margin-top: 1.25rem;
	}
}

input,
button {
	border: none;
	background: none;
}

button:not(:disabled) {
	cursor: pointer;
}

.heading {
	display: inline-block;
	font-weight: 600;
	position: relative;
}

.heading::before {
	content: "";
	position: absolute;
	bottom: -2px;
	left: 0;
	width: 100%;
	height: 2px;
	background: linear-gradient(
		90deg,
		rgba(251, 191, 36, 1) 50%,
		rgba(255, 255, 255, 1) 200%
	);
	border-radius: 0.25rem;
}

.progress {
	height: 2.25rem;
	background: rgb(240, 152, 5);
	border-radius: 0.5rem;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;

	@media screen and (min-width: 640px) {
		height: 2.5rem;
	}

	&__text {
		position: relative;
		z-index: 1;
		color: rgb(30, 41, 59);
		font-weight: bold;
		font-size: 0.875rem;

		@media screen and (min-width: 640px) {
			font-size: 1rem;
		}
	}

	&__bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: rgb(251, 191, 36);
		border-top-right-radius: 0.375rem;
		border-bottom-right-radius: 0.375rem;
		transition: all 0.2s ease;
	}
}

// resets

body[class^="body-"] h1,
body.home h1 {
	margin: auto;
}

body[class^="body-"] h2,
body.home h2 {
	margin: auto;
}

body[class^="body-"] h3,
body.home h3 {
	margin: auto;
}

button,
input,
optgroup,
select,
textarea {
	line-height: auto;
}
</style>
