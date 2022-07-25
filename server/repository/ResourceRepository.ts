import { Constructor } from 'type-fest';
import { Resource, ResourceStateData, ResourceId } from '../entity/Resource.js';
import { Repository } from './Repository.js';

export class ResourceRepository extends Repository<
	Resource,
	ResourceId,
	ResourceStateData
> {
	protected entity(): Constructor<Resource> {
		return Resource;
	}
}