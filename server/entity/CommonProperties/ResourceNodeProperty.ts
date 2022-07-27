import { ResourceNodeRepository } from '../../repository/ResourceNodeRepository.js';
import { ResourceNode, ResourceNodeId } from '../ResourceNode.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class ResourceNodeProperty extends SingleCommonProperty<
	ResourceNodeId,
	ResourceNode
> {
	constructor(node: ResourceNodeId | ResourceNode) {
		super(node, ResourceNodeRepository);
	}
}
