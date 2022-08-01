import { container } from 'tsyringe';
import { Constructor } from 'type-fest';
import { Uuid } from '../../helper/UuidHelper.js';
import { Repository } from '../../repository/Repository.js';
import { Entity } from '../Entity.js';

export class MultiCommonProperty<
	TId extends Uuid,
	T extends Entity<TId, any, any>
> {
	protected readonly property: { [key: string]: T | null } = {};
	protected readonly repository: Repository<T, TId, any>;

	constructor(
		property: TId[],
		repositoryIdentifier: Constructor<Repository<T, TId, any>>
	) {
		property.forEach((id) => this.add(id));

		this.repository = container.resolve(repositoryIdentifier);
	}

	public async getAll(): Promise<T[]> {
		try {
			for (const [id, region] of Object.entries(this.property)) {
				if (region != null) {
					continue;
				}

				const value = await this.repository.get(id as TId);
				if (value === null) {
					console.log('getAll error');
					throw new Error('.... uhm.....');
				}

				this.property[id] = value;
			}
		} catch (e) {
			console.error(e);
		}

		return Object.values(this.property) as T[];
	}

	public async add(value: T | TId) {
		const key = typeof value === 'string' ? value : (value as T).getId();
		if (this.property.hasOwnProperty(key)) {
			return;
		}

		this.property[key] = null;
	}

	public async remove(id: TId) {
		delete this.property[id]; // check containers if adding repository removal.
	}

	public has(value: T | TId): boolean {
		return this.property.hasOwnProperty(
			typeof value === 'string' ? value : (value as T).getId()
		);
	}

	public toJSON(): TId[] {
		return Object.keys(this.property) as TId[];
	}
}
