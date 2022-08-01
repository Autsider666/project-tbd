import { container } from 'tsyringe';
import { Constructor } from 'type-fest';
import { Uuid } from '../../helper/UuidHelper.js';
import { Repository } from '../../repository/Repository.js';
import { Entity } from '../Entity.js';

export class SingleCommonProperty<
	TId extends Uuid,
	T extends Entity<TId, any, any>
> {
	protected readonly repository: Repository<T, TId, any>;

	constructor(
		protected property: TId | T,
		repositoryIdentifier: Constructor<Repository<T, TId, any>>
	) {
		this.repository = container.resolve(repositoryIdentifier);
	}

	public async get(): Promise<T> {
		if (typeof this.property === 'string') {
			const value = await this.repository.get(this.property as TId);
			if (value === null) {
				throw new Error('.... uhm.....');
			}

			this.property = value;
		}

		return this.property as T;
	}

	public async set(entity: T) {
		if (
			entity.getId() === this.property ||
			(typeof this.property !== 'string' &&
				entity.getId() === (this.property as T).getId())
		) {
			return;
		}

		const proxy = await this.repository.get(entity.getId());
		if (proxy === null) {
			throw new Error('Uhm..');
		}

		this.property = proxy;
	}

	public toJSON(): TId {
		return typeof this.property === 'string'
			? this.property
			: (this.property as T).getId();
	}
}
