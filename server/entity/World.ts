import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { Region, RegionId, RegionStateData } from './Region.js';
import { Opaque } from 'type-fest';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';

export type WorldId = Opaque<Uuid, 'WorldId'>;

export type WorldStateData = {
	name: string;
	regions: RegionId[];
} & EntityStateData<WorldId>;

export type WorldClientData = WorldStateData & EntityClientData<WorldId>;

export class World extends Entity<WorldId, WorldStateData> {
	public name: string;
	private regions = new Map<RegionId, Region | null>();

	constructor(
		protected readonly serverState: ServerState,
		data: WorldStateData
	) {
		super(serverState, data);

		this.name = data.name;
		data.regions.forEach((id) => this.regions.set(id, null));
	}

	toJSON(): WorldStateData {
		return {
			id: this.id,
			name: this.name,
			regions: Array.from(this.regions.keys()),
		};
	}

	public override normalize(forClient?: Client | null): WorldClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	override prepareUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client | null
	): EntityUpdate {
		this.getRegions().forEach((region) => {
			updateObject = region.prepareUpdate(updateObject, forClient);
		});

		return super.prepareUpdate(updateObject, forClient);
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
