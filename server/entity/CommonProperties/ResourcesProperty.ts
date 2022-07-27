import { ResourceRepository } from '../../repository/ResourceRepository.js';
import { Resource, ResourceId } from '../Resource.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class ResourcesProperty extends MultiCommonProperty<
	ResourceId,
	Resource
> {
	constructor(regions: ResourceId[]) {
		super(regions, ResourceRepository);
	}
}
