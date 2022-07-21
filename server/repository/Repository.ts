import onChange, { ApplyData } from 'on-change';
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

	private onChangeCallbacks = new Map<
		TId,
		{
			(
				entity: T,
				path: string,
				value: any,
				previousValue: any,
				applyData: ApplyData
			): void;
		}[]
	>();

	public constructor(
		protected readonly serverState: ServerState,
		entities: TStateData[] = []
	) {
		this.load(entities);
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
			(path: string, value: any, previousValue: any, applyData): void => {
				this.onChangeCallbacks
					.get(entity.getId())
					?.forEach((callback) =>
						callback(entity, path, value, previousValue, applyData)
					);
			}
		);

		this.entities.set(entity.getId(), proxy);

		return proxy;
	}

	public registerOnChangeCallback(
		entity: T,
		callback: {
			(
				entity: T,
				path: string,
				value: any,
				previousValue: any,
				applyData: ApplyData
			): void;
		}
	) {
		let callbacks = this.onChangeCallbacks.get(entity.getId());
		if (!callbacks) {
			callbacks = [];
			this.onChangeCallbacks.set(entity.getId(), callbacks);
		}

		callbacks.push(callback);
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
