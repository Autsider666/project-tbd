import { ResourceRepository } from '../../repository/ResourceRepository.js';
import { Entity } from '../Entity.js';
import { Resource, ResourceId, ResourceType } from '../Resource.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class ResourcesProperty extends MultiCommonProperty<
	ResourceId,
	Resource
> {
	constructor(
		resources: ResourceId[],
		protected readonly owner: Entity<any, any, any>
	) {
		super(resources, ResourceRepository);

		for (const resource of this.getAll()) {
			resource.owner = this.owner;
		}
	}

	public override add(value: Resource | ResourceId) {
		super.add(value);

		if (!this.owner) {
			return;
		}

		if (typeof value === 'string') {
			const resource = this.repository.get(value as ResourceId);
			if (resource === null) {
				throw new Error('Weird af');
			}

			resource.owner = this.owner;
		} else {
			(value as Resource).owner = this.owner;
		}
	}

	public addResource(amount: number, type: ResourceType): void {
		for (const resource of this.getAll()) {
			if (resource.type !== type) {
				continue;
			}

			resource.addAmount(amount);
			return;
		}

		this.add(this.repository.create({ type, amount }));
	}

	public remove(id: ResourceId) {
		super.remove(id);

		this.repository.removeEntity(id);
	}
}
