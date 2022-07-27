import EventEmitter from 'events';
import onChange from 'on-change';
import { container } from 'tsyringe';
import { generateUUID, Uuid } from '../helper/UuidHelper.js';
import { Constructor } from 'type-fest';
import { Entity, EntityStateData } from '../entity/Entity.js';

type Optional<T, TKey extends keyof T> = Partial<Pick<T, TKey>> & Omit<T, TKey>;

export abstract class Repository<
	T extends Entity<TId, TStateData, any>,
	TId extends Uuid,
	TStateData extends EntityStateData<TId>
> {
	protected entities = new Map<TId, T>();
	protected readonly eventEmitter: EventEmitter =
		container.resolve(EventEmitter);

	public constructor() {
		this.eventEmitter.on(
			'create:entity:' + this.entity().name.toLowerCase(),
			(entity) => this.emitEntity(entity)
		);

		this.eventEmitter.on(
			'update:entity:' + this.entity().name.toLowerCase(),
			(entity) => this.emitEntity(entity)
		);
	}

	protected emitEntity(entity: T): void {
		this.eventEmitter.emit('emit:entity', entity);
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

	public create(data: Omit<TStateData, 'id'>): T {
		const ClassName = this.entity();
		const entity = new ClassName({
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
					applyData &&
					(applyData.name === 'prepareUpdate' ||
						applyData.name === 'prepareNestedEntityUpdate' ||
						applyData.name.includes('get'))
				) {
					return;
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
			const entity = new ClassName(entityData);
			this.addEntity(entity);
		}
	}

	public toJSON(): T[] {
		return Array.from(this.entities.values());
	}
}
