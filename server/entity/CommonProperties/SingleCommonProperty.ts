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

	public get(): T {
		if (typeof this.property === 'string') {
			const value = this.repository.get(this.property as TId);
			if (value === null) {
				throw new Error('.... uhm.....');
			}

			this.property = value;
		}

		return this.property as T;
	}

	public set(entity: T): void {
		const proxy = this.repository.get(entity.getId());
		if (proxy === null) {
			throw new Error('Uhmm..');
		}

		this.property = proxy;
	}

	public toJSON(): TId {
		return typeof this.property === 'string'
			? this.property
			: (this.property as T).getId();
	}
}
