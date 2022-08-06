export function getRandomItem<T>(
	items: T[],
	getAmount: (item: T) => number
): T {
	const weights: number[] = [];
	for (let i = 0; i < items.length; i++) {
		weights[i] = getAmount(items[i]) + (weights[i - 1] || 0);
	}

	const random = Math.random() * weights[weights.length - 1];
	for (let i = 0; i < weights.length; i++) {
		if (weights[i] > random) {
			return items[i];
		}
	}

	throw new Error('Randomizer failed');
}
