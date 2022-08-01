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

	public async getAll(): Promise<T[]> {
		for (const [id, region] of this.property) {
			if (region != null) {
				continue;
			}

			console.log('getAll before');
			const value = await this.repository.get(id);
			console.log('getAll after');
			if (value === null) {
				throw new Error('.... uhm.....');
			}

			this.property.set(id, value);
		}

		return Array.from(this.property.values()) as T[];
	}

	public async add(value: T | TId) {
		const key = typeof value === 'string' ? value : (value as T).getId();
		if (this.property.has(key)) {
			return;
		}

		await this.property.set(key, null);
	}

	public async remove(id: TId) {
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
