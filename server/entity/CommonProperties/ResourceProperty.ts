import { ServerState } from '../../ServerState.js';
import { Resource, ResourceId } from '../Resource.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class ResourceProperty extends SingleCommonProperty<
	ResourceId,
	Resource
> {
	constructor(serverState: ServerState, region: ResourceId | Resource) {
		super(serverState, region, Resource);
	}
}
