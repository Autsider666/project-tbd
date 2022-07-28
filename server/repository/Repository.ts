import EventEmitter from 'events';
import onChange from 'on-change';
import { container } from 'tsyringe';
import { generateUUID, Uuid } from '../helper/UuidHelper.js';
import { Constructor } from 'type-fest';
import { Entity, EntityStateData } from '../entity/Entity.js';

export abstract class Repository<
	T extends Entity<TId, TStateData, any>,
	TId extends Uuid,
	TStateData extends EntityStateData<TId>
> {
	protected entities: { [key: string]: T } = {};
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
		return this.entities[id] ?? null;
	}

	public getAll(): T[] {
		return Object.values(this.entities);
	}

	public removeEntity(id: TId): void {
		delete this.entities[id];
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

		this.entities[entity.getId()] = proxy;

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
		return this.getAll();
	}
}
