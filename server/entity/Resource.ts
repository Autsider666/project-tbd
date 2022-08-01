import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';

export type ResourceId = Opaque<Uuid, 'ResourceId'>;

export enum ResourceType {
	wood = 'wood',
	stone = 'stone',
	iron = 'iron',
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

	public owner: Entity<any, any, any> | null = null;

	constructor(data: ResourceStateData) {
		super(data);

		this.type = data.type;
		this.amount = data.amount;
	}

	async normalize(forClient?: Client): Promise<ResourceClientData> {
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

	async getUpdateRoomName(): Promise<string> {
		return this.owner?.getUpdateRoomName() ?? ''; //TODO fix asap
	}

	public getAmount(): number {
		return this.amount;
	}

	public removeAmount(amount: number): void {
		if (amount > this.amount) {
			throw new Error('Cannot take more than resource contains.');
		}

		this.amount -= amount;
	}

	public addAmount(amount: number): number {
		this.amount += amount;

		return this.amount;
	}
}
