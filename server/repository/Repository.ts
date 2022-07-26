import onChange, { ApplyData } from 'on-change';
import { Party } from '../entity/Party.js';
import { World } from '../entity/World.js';
import { generateUUID, Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { Constructor, Except } from 'type-fest';
import { Entity, EntityStateData } from '../entity/Entity.js';

type Optional<T, TKey extends keyof T> = Partial<Pick<T, TKey>> & Omit<T, TKey>;

export abstract class Repository<
	T extends Entity<TId, TStateData, any>,
	TId extends Uuid,
	TStateData extends EntityStateData<TId>
> {
	protected entities = new Map<TId, T>();

	public constructor(
		protected readonly serverState: ServerState,
		entities: TStateData[] = []
	) {
		this.load(entities);

		this.serverState.eventEmitter.on(
			'create:entity:' + this.entity().name.toLowerCase(),
			(entity) => this.emitEntity(entity)
		);

		this.serverState.eventEmitter.on(
			'update:entity:' + this.entity().name.toLowerCase(),
			(entity) => this.emitEntity(entity)
		);
	}

	protected emitEntity(entity: T): void {
		this.serverState.eventEmitter.emit('emit:entity', entity);
	}

	protected abstract entity(): Constructor<T>;

	public get(id: TId): T | null {
		return this.entities.get(id) ?? null;
	}

	public getAll(): T[] {
		return Array.from<T>(this.entities.values());
	}

	public removeEntity(id: TId): void {
		this.entities.delete(id);
	}

	public create(data: Except<TStateData, 'id'>): T {
		const ClassName = this.entity();
		const entity = new ClassName(this.serverState, {
			id: generateUUID(),
			...data,
		});

		return this.addEntity(entity);
	}

	protected addEntity(entity: T): T {
		const proxy = onChange(
			entity,
			function (
				path: string,
				value: any,
				previousValue: any,
				applyData
			): void {
				if (path.includes('function ()')) {
					return;
				}

				if (
					applyData != null &&
					(applyData.name === 'prepareUpdate' ||
						applyData.name === 'prepareNestedEntityUpdate' ||
						applyData.name.includes('get'))
				) {
					return;
				}

				if (this.constructor.name === 'Region') {
					console.log(this.getEntityRoomName(), path, applyData);
				}

				entity.onUpdate(this);
			}
		);

		this.entities.set(entity.getId(), proxy);

		proxy.onCreate(proxy);

		return proxy;
	}

	public load(stateData: TStateData[]): void {
		for (let entityData of stateData) {
			const ClassName = this.entity();
			const entity = new ClassName(this.serverState, entityData);
			this.addEntity(entity);
		}
	}

	public toJSON(): T[] {
		return Array.from(this.entities.values());
	}
}
