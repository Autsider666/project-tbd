import { container } from 'tsyringe';
import { Constructor } from 'type-fest';
import { Uuid } from '../../helper/UuidHelper.js';
import { Repository } from '../../repository/Repository.js';
import { Entity } from '../Entity.js';

export class MultiCommonProperty<
	TId extends Uuid,
	T extends Entity<TId, any, any>
> {
	protected readonly property = new Map<TId, T | null>();
	protected readonly repository: Repository<T, TId, any>;

	constructor(
		property: TId[],
		repositoryIdentifier: Constructor<Repository<T, TId, any>>
	) {
		property.forEach((id) => this.add(id));

		this.repository = container.resolve(repositoryIdentifier);
	}

	public getAll(): T[] {
		for (const [id, entity] of this.property) {
			if (entity != null) {
				continue;
			}

			const value = this.repository.get(id);
			if (value === null) {
				throw new Error('.... uhm.....');
			}

			this.property.set(id, value);
		}

		return Array.from(this.property.values()) as T[];
	}

	public add(value: T | TId): void {
		const key = typeof value === 'string' ? value : (value as T).getId();
		if (this.property.has(key)) {
			return;
		}

		this.property.set(key, null);
	}

	public remove(id: TId): void {
		this.property.delete(id); // check containers if adding repository removal.
	}

	public has(value: T | TId): boolean {
		return this.property.has(
			typeof value === 'string' ? value : (value as T).getId()
		);
	}

	public toJSON(): TId[] {
		return Array.from(this.property.keys());
	}
}
