import Graph from 'node-dijkstra';
import { delay, inject, singleton } from 'tsyringe';
import { RegionId } from '../entity/Region.js';
import { World } from '../entity/World.js';
import { RegionRepository } from '../repository/RegionRepository.js';
import { Uuid } from './UuidHelper.js';

export interface HasTravelTime {
	getId(): Uuid;

	getTravelTime(): number;

	getWorld(): Promise<World>;
}

export interface PathResult {
	path: string[];
	cost: number;
}

@singleton()
export class TravelTimeCalculator {
	private readonly worldCache = new Map<string, Graph>();
	private readonly pathCache = new Map<string, Map<string, PathResult>>();

	constructor(
		@inject(delay(() => RegionRepository))
		private readonly regionRepository: Readonly<RegionRepository>
	) {}

	async calculateTravelTime(
		start: HasTravelTime,
		goal: HasTravelTime
	): Promise<PathResult | null> {
		const world = await start.getWorld();
		const key = world.getId();
		if (key !== (await goal.getWorld()).getId()) {
			return null;
		}

		let graph = this.worldCache.get(key);
		if (!graph) {
			graph = await this.cacheWorld(world);
		}

		let worldPaths = this.pathCache.get(world.getId());
		if (!worldPaths) {
			worldPaths = new Map<string, PathResult>();
			this.pathCache.set(world.getId(), worldPaths);
		}

		let path = worldPaths.get(start.getId() + goal.getId());
		if (path) {
			return path;
		}

		path = graph.path(start.getId(), goal.getId(), {
			cost: true,
		}) as PathResult;

		path.path = path.path?.filter((id) =>
			this.regionRepository.has(id as RegionId)
		);
		path.cost += goal.getTravelTime();
		if (path.path === null && start.getId() === goal.getId()) {
			path.path = [start.getId()];
		}

		worldPaths.set(start.getId() + goal.getId(), path);
		worldPaths.set(goal.getId() + start.getId(), path);

		return path;
	}

	async cacheWorld(world: World): Promise<Graph> {
		const data: {
			[key: string]: {
				[key: string]: number;
			};
		} = {};
		for (const region of await world.getRegions()) {
			data[region.getId()] = {};
			for (const border of await region.getBorders()) {
				data[region.getId()][border.getId()] = region.getTravelTime();
				if (data[border.getId()]) {
					continue;
				}

				data[border.getId()] = {};
				for (const neighbor of await border.getRegions()) {
					data[border.getId()][neighbor.getId()] =
						border.getTravelTime();
				}
			}
		}

		const graph = new Graph(data);
		this.worldCache.set(world.getId(), graph);
		this.pathCache.delete(world.getId());

		return graph;
	}
}
