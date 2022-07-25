import { ServerState } from '../../ServerState.js';
import { ResourceId } from '../Resource.js';
import { ResourceNode, ResourceNodeId } from '../ResourceNode.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class ResourceNodesProperty extends MultiCommonProperty<
	ResourceNodeId,
	ResourceNode
> {
	constructor(serverState: ServerState, nodes: ResourceId[]) {
		super(serverState, nodes, ResourceNode);
	}
}
