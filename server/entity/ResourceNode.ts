import { Opaque } from 'type-fest';
import { ResourceNodeType, ResourceType } from '../config/ResourceData.js';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { RegionProperty } from './CommonProperties/RegionProperty.js';
import {
	ResourceContainer,
	Resources,
} from './CommonTypes/ResourceContainer.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Region, RegionId } from './Region.js';

export type ResourceNodeId = Opaque<Uuid, 'ResourceNodeId'>;

export type ResourceNodeStateData = {
	name: string;
	type: ResourceNodeType;
	region: RegionId;
	resources?: Resources;
} & EntityStateData<ResourceNodeId>;

export type ResourceNodeClientData = ResourceNodeStateData &
	EntityClientData<ResourceNodeId>;

export class ResourceNode
	extends Entity<
		ResourceNodeId,
		ResourceNodeStateData,
		ResourceNodeClientData
	>
	implements ResourceContainer
{
	public readonly name: string;
	public readonly type: ResourceNodeType;
	private readonly regionProperty: RegionProperty;
	private readonly resources: Resources;

	constructor(data: ResourceNodeStateData) {
		super(data);

		this.name = data.name;
		this.type = data.type;
		this.regionProperty = new RegionProperty(data.region);
		this.resources = data.resources ?? {};
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
			resources: this.resources,
		};
	}

	getUpdateRoomName(): string {
		return this.regionProperty.get().getUpdateRoomName();
	}

	getRegion(): Region {
		return this.regionProperty.get();
	}

	setRegion(region: Region): void {
		this.regionProperty.set(region);
	}

	getResources(): Resources {
		return this.resources;
	}

	addResource(amount: number, type: ResourceType): void {
		this.resources[type] = (this.resources[type] ?? 0) + amount;
	}

	removeResource(amount: number, type: ResourceType): boolean {
		if (!(type in this.resources)) {
			this.resources[type] = 0;
		}

		if ((this.resources[type] ?? 0) < amount) {
			return false;
		}

		this.resources[type] = Math.max(
			0,
			(this.resources[type] ?? 0) - amount
		);

		return true;
	}
}
