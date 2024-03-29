import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { RegionsProperty } from './CommonProperties/RegionsProperty.js';
import { Region, RegionId } from './Region.js';
import { Opaque } from 'type-fest';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';

export type WorldId = Opaque<Uuid, 'WorldId'>;

export type WorldStateData = {
	name: string;
	regions: RegionId[];
	createdAt?: string;
	destroyedAt?: string | null;
} & EntityStateData<WorldId>;

export type WorldClientData = WorldStateData & EntityClientData<WorldId>;

export class World extends Entity<WorldId, WorldStateData, WorldClientData> {
	public name: string;
	public destroyedAt: string | null;
	public readonly createdAt: string;
	private readonly regions: RegionsProperty;

	constructor(data: WorldStateData) {
		super(data);

		this.name = data.name;
		this.regions = new RegionsProperty(data.regions);
		this.createdAt = data.createdAt ?? new Date().toString();
		this.destroyedAt = data.destroyedAt ?? null;
	}

	toJSON(): WorldStateData {
		return {
			id: this.id,
			name: this.name,
			regions: this.regions.toJSON(),
			createdAt: this.createdAt,
			destroyedAt: this.destroyedAt,
		};
	}

	getUpdateRoomName(): string {
		return this.getEntityRoomName();
	}

	public override normalize(forClient?: Client): WorldClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	async prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): Promise<EntityUpdate> {
		for (const region of this.getRegions()) {
			updateObject = await region.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		return super.prepareNestedEntityUpdate(updateObject, forClient);
	}

	public getRegions(): Region[] {
		return this.regions.getAll();
	}

	public addRegion(region: Region): void {
		this.regions.add(region);
	}
}
