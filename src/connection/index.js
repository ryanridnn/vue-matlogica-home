import { useConnectionStore } from "../store";
import { convertData } from "../utils";
import { STATUS } from "../constants";

export const useConnection = (url) => {
	const connection = useConnectionStore();

	const on_error = () => {
		alert(
			"Can not connect to WebSocket. Make sure the server is running and the uri is valid."
		);
	};

	const on_open = () => {
		connection.setConnected(true);
		connection.setGotInitial(false);
	};

	const on_close = () => {
		connection.setWs(null);
		connection.setConnected(false);
		console.log("close");
	};

	const on_message = (message) => {
		processMessage(message);
	};

	if (connection.connected) {
		return;
	}

	try {
		const ws = new WebSocket(url);

		ws.onerror = on_error;
		ws.onclose = on_close;
		ws.onmessage = on_message;
		ws.onopen = on_open;

		connection.setWs(ws);
	} catch (e) {
		alert(e);
	}
};

export const disconnect = () => {
	const connection = useConnectionStore();

	if (!connection.connected) {
		return;
	}

	connection.ws.close();
};

export const updateParam = (
	nodeIndex,
	key,
	value,
	isValuePercentage = false
) => {
	const connection = useConnectionStore();

	if (!connection.connected) {
		return;
	} else {
		if (isValuePercentage) {
			connection.ws.send(
				JSON.stringify({
					type: "param_update",
					node_ind: nodeIndex,
					key,
					value: String(value / 100),
				})
			);
		} else {
			connection.ws.send(
				JSON.stringify({
					type: "param_update",
					node_ind: nodeIndex,
					key,
					value: String(value),
				})
			);
		}

		const params = {};

		params[key] = value;

		connection.setDagNodesInput(params, nodeIndex);
	}
};

const processMessage = (message) => {
	const connection = useConnectionStore();

	if (!connection.gotInitial) {
		try {
			const data = convertData(message);

			connection.ws.send(
				JSON.stringify({
					type: "got_message",
				})
			);

			connection.setDagNodes(data.dag_nodes);
			data.dag_nodes.forEach((node, index) => {
				connection.setStatus(index, STATUS.NOT_READY);

				connection.setProgress(index, 0);
			});
			addMoreInputParams();
			connection.setGotInitial(true);
		} catch (e) {
			alert("Can not parse dag nodes");
		}
	} else {
		const data = convertData(message);

		if (data.type === "progress") {
			if (!connection.loadComplete && data.node_ind === 0) {
				connection.setInitialLoadProgress(data.progress);
			}
			connection.setStatus(data.node_ind, STATUS.IN_PROGRESS);
			connection.setProgress(data.node_ind, data.progress);
		} else if (data.type === "completed") {
			if (!connection.loadComplete && data.node_ind === 1) {
				connection.setInitialLoadProgress(1);
				connection.setLoadComplete(true);
			}
			connection.setStatus(data.node_ind, STATUS.COMPLETED);
			connection.setProgress(data.node_ind, 1);
			connection.setDagNodesOutput(data.results, data.node_ind);
		}
	}
};

const addMoreInputParams = () => {
	const connection = useConnectionStore();

	connection.setDagNodesInput(
		{
			parallel_tilt: 0,
			parallel_twist: 0,
		},
		1
	);
};
