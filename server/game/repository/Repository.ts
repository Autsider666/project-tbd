import { ServerState } from '../../ServerState.js';
import { Constructor } from 'type-fest';
import { Entity } from '../entity/Entity.js';

export abstract class Repository<
	T extends Entity<TId, TData>,
	TId extends number,
	TData extends object
> {
	/** The loaded entities */
	protected entities = new Map<TId, T>();

	/** ID counter for new entities */
	private nextId: TId = 0 as TId;

	public constructor(
		protected readonly serverState: ServerState,
		entities: TData[] = []
	) {
		this.load(entities);
	}

	/** The entity class, used to create new entities when loading data */
	protected abstract entity(): Constructor<T>;

	public get(id: TId): T | null {
		return this.entities.get(id) ?? null;
	}

	public getAll(): T[] {
		return Array.from<T>(this.entities.values());
	}

	public delete(id: TId): void {
		this.entities.delete(id);
	}

	protected addEntity(entity: T): void {
		this.entities.set(entity.id, this.onCreate(entity));
	}

	protected onCreate(entity: T): T {
		return entity;
	}
	// protected createEntity(): T {
	// 	let entity = new T(this.world);
	// 	entity.id = this.nextId;
	// 	this.nextId++;
	//
	// 	this.addEntity(entity);
	// 	entity.onCreate();
	//
	// 	return entity;
	// }

	/**
	 * Loads data into the repository
	 */
	public load(data: TData[]): void {
		for (let entry of data) {
			const ClassName = this.entity();
			let entity = new ClassName(this.serverState, entry);
			this.addEntity(entity);

			if (entity.id >= this.nextId) {
				this.nextId = (entity.id + 1) as TId;
			}
		}
	}

	/**
	 * Exports data from the repository for saving
	 */
	public save(): TData[] {
		let data: TData[] = [];

		for (let entity of this.entities.values()) {
			data.push(entity.normalize());
		}

		return data;
	}

	public toJSON(): T[] {
		return Array.from(this.entities.values());
	}
}
