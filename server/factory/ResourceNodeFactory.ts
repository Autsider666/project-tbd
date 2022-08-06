import { injectable } from 'tsyringe';
import {
	ResourceNodeMapping,
	ResourceNodeType,
	ResourceType,
} from '../config/ResourceData.js';
import { Region } from '../entity/Region.js';
import { ResourceNode } from '../entity/ResourceNode.js';
import { ResourceNodeRepository } from '../repository/ResourceNodeRepository.js';

@injectable()
export class ResourceNodeFactory {
	constructor(private readonly nodeRepository: ResourceNodeRepository) {}

	create(name: string, type: ResourceNodeType, region: Region): ResourceNode {
		const node = this.nodeRepository.create({
			name,
			type,
			region: region.getId(),
		});

		Object.entries(ResourceNodeMapping[type]).forEach(([type, amount]) => {
			node.addResource(amount, type as ResourceType);
		});

		region.addResourceNode(node);

		return node;
	}
}
