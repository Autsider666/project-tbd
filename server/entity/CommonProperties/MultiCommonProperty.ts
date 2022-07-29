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
		property.forEach((id) => this.property.set(id, null));

		this.repository = container.resolve(repositoryIdentifier);
	}

	public getAll(): T[] {
		for (const [id, region] of this.property) {
			if (region != null) {
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

	public add(value: T): void {
		if (this.property.has(value.getId())) {
			return;
		}

		this.property.set(value.getId(), null);
	}

	public remove(value: T): void {
		this.property.delete(value.getId());
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
