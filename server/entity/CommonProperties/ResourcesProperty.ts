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
		private readonly owner: Entity<any, any, any>
	) {
		super(resources, ResourceRepository);

		for (const resource of this.getAll()) {
			resource.owner = this.owner;
		}
	}

	public add(value: Resource) {
		super.add(value);

		value.owner = this.owner;
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
