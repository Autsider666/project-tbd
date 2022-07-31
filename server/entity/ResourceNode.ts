import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { RegionProperty } from './CommonProperties/RegionProperty.js';
import { ResourcesProperty } from './CommonProperties/ResourcesProperty.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Region, RegionId } from './Region.js';
import { Resource, ResourceId } from './Resource.js';

export type ResourceNodeId = Opaque<Uuid, 'ResourceNodeId'>;

export enum ResourceNodeType {
	Tower = 'tower',
	Ruin = 'ruin',
	Forest = 'forest',
	Mountain = 'mountain',
}

export type ResourceNodeStateData = {
	name: string;
	type: ResourceNodeType;
	region: RegionId;
	resources?: ResourceId[];
} & EntityStateData<ResourceNodeId>;

export type ResourceNodeClientData = ResourceNodeStateData &
	EntityClientData<ResourceNodeId>;

export class ResourceNode extends Entity<
	ResourceNodeId,
	ResourceNodeStateData,
	ResourceNodeClientData
> {
	public readonly name: string;
	public readonly type: ResourceNodeType;
	private readonly regionProperty: RegionProperty;
	private readonly resourcesProperty: ResourcesProperty;

	constructor(data: ResourceNodeStateData) {
		super(data);

		this.name = data.name;
		this.type = data.type;
		this.regionProperty = new RegionProperty(data.region);
		this.resourcesProperty = new ResourcesProperty(
			data.resources ?? [],
			this
		);
	}

	normalize(forClient?: Client): ResourceNodeClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	toJSON(): ResourceNodeStateData {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			region: this.regionProperty.toJSON(),
			resources: this.resourcesProperty.toJSON(),
		};
	}

	getUpdateRoomName(): string {
		return this.regionProperty.get().getUpdateRoomName();
	}

	async prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): Promise<EntityUpdate> {
		for (const resource of this.resourcesProperty.getAll()) {
			updateObject = await resource.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		return super.prepareNestedEntityUpdate(updateObject, forClient);
	}

	getRegion(): Region {
		return this.regionProperty.get();
	}

	setRegion(region: Region): void {
		this.regionProperty.set(region);
	}

	getResources(): Resource[] {
		return this.resourcesProperty.getAll();
	}

	addResource(resource: Resource): void {
		this.resourcesProperty.add(resource);
	}
}
