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
	}

	public override async add(value: Resource | ResourceId) {
		await super.add(value);

		if (typeof value === 'string') {
			const resource = await this.repository.get(value as ResourceId);
			if (resource === null) {
				throw new Error('Weird af');
			}

			resource.owner = this.owner;
		} else {
			(value as Resource).owner = this.owner;
		}
	}

	public async addResource(
		amount: number,
		type: ResourceType
	): Promise<void> {
		for (const resource of await this.getAll()) {
			if (resource.type !== type) {
				continue;
			}

			resource.addAmount(amount);
			return;
		}

		await this.add(await this.repository.create({ type, amount }));
	}

	public async remove(id: ResourceId) {
		await super.remove(id);

		this.repository.removeEntity(id);
	}
}
