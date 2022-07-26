import { Constructor } from 'type-fest';
import { Uuid } from '../../helper/UuidHelper.js';
import { ServerState } from '../../ServerState.js';
import { Entity } from '../Entity.js';

export class SingleCommonProperty<
	TId extends Uuid,
	T extends Entity<TId, any, any>
> {
	constructor(
		protected readonly serverState: ServerState,
		protected property: TId | T,
		protected readonly repositoryIdentifier: Constructor<T>
	) {}

	public get(): T {
		if (typeof this.property === 'string') {
			const repository = this.serverState.getRepository(
				this.repositoryIdentifier
			);

			const value = repository.get(this.property as TId);
			if (value === null) {
				throw new Error('.... uhm.....');
			}

			this.property = value;
		}

		return this.property as T;
	}

	public set(entity: T): void {
		this.property = entity;
	}

	public toJSON(): TId {
		return typeof this.property === 'string'
			? this.property
			: (this.property as T).getId();
	}
}
