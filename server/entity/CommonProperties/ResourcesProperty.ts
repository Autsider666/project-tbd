import { ServerState } from '../../ServerState.js';
import { Resource, ResourceId } from '../Resource.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class ResourcesProperty extends MultiCommonProperty<
	ResourceId,
	Resource
> {
	constructor(serverState: ServerState, regions: ResourceId[]) {
		super(serverState, regions, Resource);
	}
}
