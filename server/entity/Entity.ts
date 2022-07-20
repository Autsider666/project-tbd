import { EntityUpdate } from '../controller/StateSyncController.js';
import { ServerState } from '../ServerState.js';

export type EntityData<TId extends number> = {
	id: TId;
	entityType: string;
};

export abstract class Entity<
	TId extends number,
	TData extends EntityData<TId>
> {
	protected id: TId;
	protected entityType: string;

	protected constructor(
		protected readonly serverState: ServerState,
		data: TData
	) {
		this.id = data.id;
		this.entityType = data.entityType;
	}

	// public abstract denormalize(data: TData): void;

	public abstract normalize(): TData;

	public toJSON(): TData {
		return this.normalize();
	}

	public getEntityRoomName(): string {
		return 'entity:' + this.constructor.name.toLowerCase() + ':' + this.id;
	}

	public getId(): TId {
		return this.id;
	}

	public prepareUpdate(updateObject: EntityUpdate = {}): EntityUpdate {
		if (!(this.getEntityRoomName() in updateObject)) {
			updateObject[this.getEntityRoomName()] = this;
		}

		return updateObject;
	}
}
