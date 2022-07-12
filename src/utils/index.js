export const convertData = (message) => {
	return JSON.parse(message.data);
};

export const copy = (text) => {
	navigator.clipboard.writeText(text);
};

export const validateSubmit = (e, callback) => {
	if (
		e.code === "Enter" &&
		e.target.value !== "" &&
		!isNaN(Number(e.target.value))
	) {
		callback();
	}
};

export const useDebounced = () => {
	let timeout = null;

	return (callback, time) => {
		clearTimeout(timeout);
		timeout = setTimeout(callback, time);
	};
};

export const useThrottle = () => {
	let timeout = null;

	return (callback, time) => {
		if (timeout) return;

		timeout = setTimeout(() => {
			callback();
			clearTimeout(timeout);
			timeout = null;
		}, time);
	};
};

export const generateRandomNumber = (min = 0, max = 100) => {
	return Math.random() * (max - min) + min;
};

const formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export const formatToUSD = (num) => {
	return formatter.format(num);
};
