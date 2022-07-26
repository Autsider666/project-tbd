import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
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
	constructor(serverState: ServerState, data: ExpeditionStateData) {
		super(serverState, data);
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
