import Graph from 'node-dijkstra';
import { World } from '../entity/World.js';

export interface HasTravelTime {
	getEntityRoomName(): string;

	getTravelTime(): number;

	getNextTravelDestinations(): HasTravelTime[];

	getWorld(): World;
}

const worldCache = new Map<string, Graph>();
const pathCache = new Map<string, Map<string, PathResult>>();

export interface PathResult {
	path: string[];
	cost: number;
}

export function cacheWorld(world: World): Graph {
	const data: {
		[key: string]: {
			[key: string]: number;
		};
	} = {};
	for (const region of world.getRegions()) {
		data[region.getEntityRoomName()] = {};
		for (const border of region.getBorders()) {
			data[region.getEntityRoomName()][border.getEntityRoomName()] =
				region.getTravelTime();
			if (data[border.getEntityRoomName()]) {
				continue;
			}

			data[border.getEntityRoomName()] = {};
			for (const neighbor of border.getRegions()) {
				data[border.getEntityRoomName()][neighbor.getEntityRoomName()] =
					border.getTravelTime();
			}
		}
	}

	const graph = new Graph(data);
	worldCache.set(world.getEntityRoomName(), graph);
	pathCache.delete(world.getEntityRoomName());

	return graph;
}

export function calculateTravelTime(
	start: HasTravelTime,
	goal: HasTravelTime
): PathResult | null {
	const world = start.getWorld();
	const key = world.getEntityRoomName();
	if (key !== goal.getWorld().getEntityRoomName()) {
		return null;
	}

	let graph = worldCache.get(key);
	if (!graph) {
		graph = cacheWorld(world);
	}

	let worldPaths = pathCache.get(world.getEntityRoomName());
	if (!worldPaths) {
		worldPaths = new Map<string, PathResult>();
		pathCache.set(world.getEntityRoomName(), worldPaths);
	}

	let path = worldPaths.get(
		start.getEntityRoomName() + goal.getEntityRoomName()
	);
	if (path) {
		return path;
	}

	path = graph.path(start.getEntityRoomName(), goal.getEntityRoomName(), {
		cost: true,
	}) as PathResult;

	path.cost += goal.getTravelTime();

	worldPaths.set(start.getEntityRoomName() + goal.getEntityRoomName(), path);
	worldPaths.set(goal.getEntityRoomName() + start.getEntityRoomName(), path);

	return path;
}
