import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { RegionProperty } from './CommonProperties/RegionProperty.js';
import { ResourcesProperty } from './CommonProperties/ResourcesProperty.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { RegionId } from './Region.js';
import { ResourceId } from './Resource.js';

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
	resources: ResourceId[];
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
		this.resourcesProperty = new ResourcesProperty(data.resources);
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

	override prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): EntityUpdate {
		this.resourcesProperty
			.getAll()
			.forEach(
				(resource) =>
					(updateObject = resource.prepareNestedEntityUpdate(
						updateObject,
						forClient
					))
			);

		return super.prepareNestedEntityUpdate(updateObject, forClient);
	}
}
