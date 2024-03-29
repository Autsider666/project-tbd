import EventEmitter from 'events';
import { container } from 'tsyringe';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';

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
	TClientData extends EntityClientData<TId>
> {
	protected id: TId;

	protected readonly eventEmitter: EventEmitter =
		container.resolve(EventEmitter);

	protected constructor(data: TStateData) {
		this.id = data.id;
	}

	public abstract normalize(forClient?: Client): TClientData;

	public abstract toJSON(): TStateData;

	public abstract getUpdateRoomName(): string;

	public getEntityTypeIdentifier(): string {
		return 'entity:' + this.constructor.name.toLowerCase();
	}

	public getEntityRoomName(): string {
		return this.getEntityTypeIdentifier() + ':' + this.id;
	}

	public getId(): TId {
		return this.id;
	}

	public onCreate(proxy: this): void {
		this.eventEmitter.emit(
			`create:${this.getEntityTypeIdentifier()}`,
			proxy
		);
	}

	public onUpdate(proxy: this): void {
		this.eventEmitter.emit(
			`update:${this.getEntityTypeIdentifier()}`,
			proxy
		);
	}

	public async prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): Promise<EntityUpdate> {
		return await this.prepareEntityUpdate(updateObject, forClient);
	}

	public async prepareEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): Promise<EntityUpdate> {
		if (!(this.getEntityRoomName() in updateObject)) {
			updateObject[this.getEntityRoomName()] = this.normalize(forClient);
		}

		return updateObject;
	}

	public getEntityType(): string {
		return this.constructor.name.toLowerCase();
	}
}
