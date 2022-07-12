import { defineStore } from "pinia";
import { formatToUSD } from "../utils";

export const useConnectionStore = defineStore("connectionStore", {
	state: () => {
		return {
			ws: null,
			connected: false,
			loadComplete: false,
			initialLoadProgress: 0,
			dagNodes: [],
			dagNodesStatus: [],
			dagNodesProgress: [],
			gotInitial: false,
			randomizeData: true,
		};
	},
	actions: {
		setWs(ws) {
			this.ws = ws;
		},
		setConnected(bool) {
			this.connected = bool;
		},
		setDagNodes(dagNodes) {
			this.dagNodes = dagNodes;
		},
		setDagNodesInput(params, nodeIndex) {
			this.dagNodes[nodeIndex].input_params = {
				...this.dagNodes[nodeIndex].input_params,
				...params,
			};
		},
		setDagNodesOutput(output, nodeIndex) {
			this.dagNodes[nodeIndex].output_params = output;
		},
		setGotInitial(bool) {
			this.gotInitial = bool;
		},
		setStatus(nodeIndex, status) {
			this.dagNodesStatus[nodeIndex] = status;
		},
		setProgress(nodeIndex, progress) {
			this.dagNodesProgress[nodeIndex] = progress;
		},
		setLoadComplete(bool) {
			this.loadComplete = bool;
		},
		setInitialLoadProgress(progress) {
			this.initialLoadProgress = progress;
		},
		setRandomizeData(bool) {
			this.randomizeData = bool;
		},
	},
	getters: {
		dagNodesLength: (state) => {
			if (!state.dagNodes) {
				return 0;
			} else {
				return state.dagNodes.length;
			}
		},
		priceAndRisk: (state) => {
			return state.dagNodes[1];
		},
		portfolio: (state) => {
			return state.dagNodes[0];
		},
		marketRates: (state) => {
			if (
				state.priceAndRisk &&
				state.portfolio &&
				state.priceAndRisk.output_params.MarketRates &&
				state.portfolio.output_params.OriginalMarketRates
			) {
				let currentMarketRates = {};
				let originalMarketRates = {};

				state.priceAndRisk.output_params.MarketRates.map((arr) => {
					currentMarketRates[arr[0]] = arr[1];
				});

				state.portfolio.output_params.OriginalMarketRates.map((arr) => {
					originalMarketRates[arr[0]] = arr[1];
				});

				return [currentMarketRates, originalMarketRates];
			} else {
				return [];
			}
		},
		fittedValues: (state) => {
			if (
				state.priceAndRisk &&
				state.priceAndRisk.output_params.fitted_values_forecast &&
				state.priceAndRisk.output_params.fitted_values_discount
			) {
				return [
					state.priceAndRisk.output_params.fitted_values_forecast,
					state.priceAndRisk.output_params.fitted_values_discount,
				];
			} else {
				return [];
			}
		},
		risk: (state) => {
			let risk = {};

			if (state.priceAndRisk && state.priceAndRisk.output_params.Risk) {
				state.priceAndRisk.output_params.Risk.map((arr) => {
					risk[arr[0]] = arr[1];
				});
				return risk;
			} else {
				return risk;
			}

			return (
				(state.priceAndRisk
					? state.priceAndRisk.output_params.Risk
					: []) || []
			);
		},
		portfolioNPV: (state) => {
			return (
				(state.priceAndRisk &&
				state.priceAndRisk.output_params.PortfolioNPV
					? formatToUSD(
							state.priceAndRisk.output_params.PortfolioNPV.toFixed(
								2
							)
					  )
					: "$0") || "$0"
			);
		},
		currentValuationTime: (state) => {
			return (
				(state.priceAndRisk && state.priceAndRisk.output_params.CalcTime
					? state.priceAndRisk.output_params.CalcTime.toFixed(2)
					: 0) || 0
			);
		},
		irSwaps: (state) => {
			return (
				(state.portfolio
					? state.portfolio.input_params.NumTrades
					: 0) || 0
			);
		},
		portfolioLoadTime: (state) => {
			return (
				(state.portfolio && state.portfolio.output_params.CalcTime
					? state.portfolio.output_params.CalcTime.toFixed(2)
					: 0) || 0
			);
		},
		trades: (state) => {
			return state.portfolio ? state.portfolio.output_params.Trades : [];
		},
		tradesNPV: (state) => {
			if (
				state.portfolio &&
				state.priceAndRisk &&
				state.portfolio.output_params.Trades &&
				state.priceAndRisk.output_params.TradeNPV
			) {
				let tradesNPV = state.priceAndRisk.output_params.TradeNPV.map(
					(npv, index) => {
						return {
							...state.portfolio.output_params.Trades[index],
							npv: formatToUSD(npv),
						};
					}
				);
				return tradesNPV;
			} else {
				return [];
			}
		},
	},
});

export const useAlertStore = defineStore("alertStore", {
	state: () => ({
		show: false,
		message: "",
		timeout: null,
	}),
	actions: {
		showAlert(message, time = 5000) {
			clearTimeout(this.timeout);
			this.show = true;
			this.message = message;

			this.timeout = setTimeout(() => {
				this.show = false;
				this.message = null;
			}, time);
		},
	},
});
