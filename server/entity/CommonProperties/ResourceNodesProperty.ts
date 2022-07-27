import { ResourceNodeRepository } from '../../repository/ResourceNodeRepository.js';
import { ResourceId } from '../Resource.js';
import { ResourceNode, ResourceNodeId } from '../ResourceNode.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class ResourceNodesProperty extends MultiCommonProperty<
	ResourceNodeId,
	ResourceNode
> {
	constructor(nodes: ResourceId[]) {
		super(nodes, ResourceNodeRepository);
	}
}
