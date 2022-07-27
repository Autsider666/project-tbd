import { ResourceRepository } from '../../repository/ResourceRepository.js';
import { Resource, ResourceId } from '../Resource.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class ResourceProperty extends SingleCommonProperty<
	ResourceId,
	Resource
> {
	constructor(region: ResourceId | Resource) {
		super(region, ResourceRepository);
	}
}
