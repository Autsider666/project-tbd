import EventEmitter from 'events';
import { Collection, Db, OptionalUnlessRequiredId } from 'mongodb';
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
	// private readonly database: Db =
	// 	container.resolve(Db);
	// private collection: Collection<TStateData>;

	public constructor() {
		this.eventEmitter.on(
			'create:entity:' + this.entity().name.toLowerCase(),
			(entity) => this.emitEntity(entity)
		);

		this.eventEmitter.on(
			'update:entity:' + this.entity().name.toLowerCase(),
			async (entity: T) => {
				// await this.collection.replaceOne({id: entity.getId()}, entity.toJSON())
				this.emitEntity(entity);
			}
		);

		// this.collection = this.database.collection<TStateData>(this.entity().name);
	}

	protected emitEntity(entity: T): void {
		this.eventEmitter.emit('emit:entity', entity);
	}

	protected abstract entity(): Constructor<T>;

	public has(id: TId): boolean {
		return this.entities.hasOwnProperty(id);
	}

	public async get(id: TId): Promise<T | null> {
		if (this.has(id)) {
			return this.entities[id];
		}

		return null;

		// const data = await this.collection.findOne({id});
		// // console.log(data);
		// if (data === null) {
		// 	return null;
		// }
		//
		// return this.createEntityFromStateData(data as TStateData);
	}

	public async getAll(): Promise<T[]> {
		return Object.values(this.entities);
	}

	public removeEntity(id: TId): void {
		delete this.entities[id];
	}

	public async create(data: Omit<TStateData, 'id'>): Promise<T> {
		return this.addEntity({
			id: generateUUID(),
			...data,
		} as TStateData);
	}

	private createEntityFromStateData(stateData: TStateData): T {
		if (this.has(stateData.id)) {
			return this.entities[stateData.id];
		}

		const ClassName = this.entity();
		const entity = new ClassName(stateData);
		return onChange(
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
	}

	protected async addEntity(stateData: TStateData): Promise<T> {
		const entity = this.createEntityFromStateData(stateData);

		this.entities[entity.getId()] = entity;
		// await this.collection.insertOne(entity.toJSON() as OptionalUnlessRequiredId<TStateData>);

		entity.onCreate(entity);

		this.onAdd(entity);

		return entity;
	}

	public async load(stateData: TStateData[]): Promise<void> {
		// console.log('load?');
		// const collections = await this.database.listCollections().toArray();
		// console.log(collections);
		// if (collections.filter((collection)=> collection.name === this.entity().name).length === 0) {
		// 	this.collection = await this.database.createCollection<TStateData>(this.entity().name);
		// } else {
		// 	this.collection = this.database.collection<TStateData>(this.entity().name);
		// }
		// console.log(2);

		for (let entityData of stateData) {
			await this.addEntity(entityData);
		}
	}

	protected onAdd(entity: T): void {}

	public async toJSON(): Promise<T[]> {
		return this.getAll();
	}
}
