import { Constructor } from 'type-fest';
import { Uuid } from '../../helper/UuidHelper.js';
import { ServerState } from '../../ServerState.js';
import { Entity } from '../Entity.js';

export class MultiCommonProperty<
	TId extends Uuid,
	T extends Entity<TId, any, any>
> {
	private readonly property = new Map<TId, T | null>();

	constructor(
		protected readonly serverState: ServerState,
		property: TId[],
		protected readonly repositoryIdentifier: Constructor<T>
	) {
		property.forEach((id) => this.property.set(id, null));
	}

	public getAll(): T[] {
		this.property.forEach((region, id) => {
			if (region != null) {
				return;
			}

			const value = this.serverState
				.getRepository(this.repositoryIdentifier)
				.get(id);
			if (value === null) {
				throw new Error('.... uhm.....');
			}

			this.property.set(id, value);
		});

		return Array.from(this.property.values()) as T[];
	}

	public add(value: T): void {
		this.property.set(value.getId(), value);
	}

	public remove(value: T): void {
		this.property.delete(value.getId());
	}

	public has(value: T): boolean {
		return this.property.has(value.getId());
	}

	public toJSON(): TId[] {
		return Array.from(this.property.keys());
	}
}
