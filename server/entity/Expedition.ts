import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';

export type ExpeditionId = Opaque<Uuid, 'ExpeditionId'>;

export type ExpeditionStateData = {} & EntityStateData<ExpeditionId>;

export type ExpeditionClientData = ExpeditionStateData &
	EntityClientData<ExpeditionId>;

export class Expedition extends Entity<
	ExpeditionId,
	ExpeditionStateData,
	ExpeditionClientData
> {
	constructor(data: ExpeditionStateData) {
		super(data);
	}

	normalize(forClient?: Client): ExpeditionClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	toJSON(): ExpeditionStateData {
		return {
			id: this.id,
		};
	}

	getUpdateRoomName(): string {
		return this.getEntityRoomName(); //TODO update asap
	}
}
