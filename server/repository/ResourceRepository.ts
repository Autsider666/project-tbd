import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import { Resource, ResourceStateData, ResourceId } from '../entity/Resource.js';
import { Repository } from './Repository.js';

@singleton()
@registry([{ token: 'Repository', useValue: ResourceRepository }])
export class ResourceRepository extends Repository<
	Resource,
	ResourceId,
	ResourceStateData
> {
	constructor() {
		super();

		setInterval(() => {
			for (const resource of Object.values(this.entities).filter(
				(resource) => !resource.owner
			)) {
				console.error('Resource without owner found:', resource);
			}
		}, 60000);
	}

	protected entity(): Constructor<Resource> {
		return Resource;
	}
}
