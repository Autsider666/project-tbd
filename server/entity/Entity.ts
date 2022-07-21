import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';

export type EntityStateData<TId extends Uuid> = {
	id: TId;
};

export type EntityClientData<TId extends Uuid> = {
	id: TId;
	entityType: string;
};

export abstract class Entity<
	TId extends Uuid,
	TStateData extends EntityStateData<TId>,
	TClientData extends EntityClientData<TId> = TStateData &
		EntityClientData<TId>
> {
	protected id: TId;

	protected constructor(
		protected readonly serverState: ServerState,
		data: TStateData
	) {
		this.id = data.id;
	}

	public abstract normalize(forClient?: Client | null): TClientData;

	public abstract toJSON(): TStateData;

	public getEntityRoomName(): string {
		return 'entity:' + this.constructor.name.toLowerCase() + ':' + this.id;
	}

	public getId(): TId {
		return this.id;
	}

	public prepareUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client | null
	): EntityUpdate {
		if (!(this.getEntityRoomName() in updateObject)) {
			updateObject[this.getEntityRoomName()] = this.normalize(forClient);
		}

		return updateObject;
	}

	public getEntityType(): string {
		return this.constructor.name.toLowerCase();
	}
}
