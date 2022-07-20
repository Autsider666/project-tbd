import { EntityUpdate } from '../controller/StateSyncController.js';
import { ServerState } from '../ServerState.js';
import { Region, RegionId } from './Region.js';
import { Opaque } from 'type-fest';
import { Entity } from './Entity.js';

export type WorldId = Opaque<number, 'WorldId'>;

export type WorldData = {
	id: WorldId;
	entityType: string;
	name: string;
	regions: RegionId[];
};

export class World extends Entity<WorldId, WorldData> {
	public name: string;
	private regions = new Map<RegionId, Region | null>();

	constructor(protected readonly serverState: ServerState, data: WorldData) {
		super(serverState, data);

		this.id = data.id;
		this.name = data.name;
		data.regions.forEach((id) => this.regions.set(id, null));
	}

	denormalize(data: WorldData): void {
		this.id = data.id;
		this.name = data.name;
		this.regions.clear();
		data.regions.forEach((id) => this.regions.set(id, null));
	}

	normalize(): WorldData {
		return {
			id: this.id,
			entityType: this.entityType,
			name: this.name,
			regions: Array.from(this.regions.keys()),
		};
	}

	override prepareUpdate(updateObject: EntityUpdate = {}): EntityUpdate {
		this.getRegions().forEach((region) => {
			updateObject = region.prepareUpdate(updateObject);
		});

		return super.prepareUpdate(updateObject);
	}

	public getRegions(): Region[] {
		this.regions.forEach((region, id) => {
			if (region !== null) {
				return;
			}

			const lazyLoadedRegion = this.serverState
				.getRepository(Region)
				.get(id);
			if (lazyLoadedRegion === null) {
				throw new Error('.... uhm.....');
			}

			this.regions.set(id, lazyLoadedRegion);
		});

		return Array.from(this.regions.values()) as Region[];
	}
}
