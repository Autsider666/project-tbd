import { Uuid } from './UuidHelper.js';

export interface HasTravelTime {
	getId(): Uuid;

	getTravelTime(): number;

	getNextTravelDestinations(): HasTravelTime[];
}

const cache = new Map<string, number>();

export function calculateTravelTime(
	start: HasTravelTime,
	goal: HasTravelTime
): number | null {
	return 10;

	// const previousTravelTime = cache.get(`${start.getId()}-${goal.getId()}`);
	// if (previousTravelTime) {
	// 	return previousTravelTime;
	// }
	//
	// let frontier: [number, HasTravelTime][] = [[0, start]];
	// const cameFrom = new Map<Uuid, HasTravelTime | null>();
	// const costSoFar = new Map<Uuid, number>();
	// cameFrom.set(start.getId(), null);
	// costSoFar.set(start.getId(), start.getTravelTime());
	//
	// let minimalTravelTime: number | null = null;
	// while (frontier.length > 0) {
	// 	frontier.sort((a, b) => a[0] - b[0]);
	// 	const current = (frontier.shift() as [number, HasTravelTime])[1];
	//
	// 	if (current.getId() === goal.getId()) {
	// 		minimalTravelTime = costSoFar.get(goal.getId()) ?? null;
	// 		break;
	// 	}
	//
	// 	for (const next of current.getNextTravelDestinations()) {
	// 		const newCost =
	// 			(costSoFar.get(current.getId()) ?? 0) + current.getTravelTime();
	// 		if (
	// 			cameFrom.has(next.getId()) &&
	// 			newCost >= (costSoFar.get(next.getId()) ?? 0)
	// 		) {
	// 			continue;
	// 		}
	//
	// 		costSoFar.set(next.getId(), newCost);
	// 		frontier.push([newCost, next]);
	// 		cameFrom.set(next.getId(), current);
	// 	}
	// }
	//
	// if (minimalTravelTime !== null) {
	// 	cache.set(`${start.getId()}-${goal.getId()}`, minimalTravelTime);
	// 	cache.set(`${goal.getId()}-${start.getId()}`, minimalTravelTime);
	// }
	//
	// return minimalTravelTime;
}
