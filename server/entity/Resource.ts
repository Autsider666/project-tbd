import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';

export type ResourceId = Opaque<Uuid, 'ResourceId'>;

export enum ResourceType {
	wood = 'wood',
	stone = 'stone',
	iron = 'iron'
}

export type ResourceStateData = {
	type: ResourceType;
	amount: number;
} & EntityStateData<ResourceId>;

export type ResourceClientData = ResourceStateData &
	EntityClientData<ResourceId>;

export class Resource extends Entity<
	ResourceId,
	ResourceStateData,
	ResourceClientData
> {
	public readonly type: ResourceType;
	private amount: number;

	constructor(serverState: ServerState, data: ResourceStateData) {
		super(serverState, data);

		this.type = data.type;
		this.amount = data.amount;
	}

	normalize(forClient: Client | undefined): ResourceClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	toJSON(): ResourceStateData {
		return {
			id: this.id,
			type: this.type,
			amount: this.amount,
		};
	}
}
