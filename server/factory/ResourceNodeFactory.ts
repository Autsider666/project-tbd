import { injectable } from 'tsyringe';
import { ResourceNodeMapping } from '../config/ResourceNodeMapping.js';
import { Region } from '../entity/Region.js';
import { ResourceType } from '../entity/Resource.js';
import { ResourceNode, ResourceNodeType } from '../entity/ResourceNode.js';
import { ResourceNodeRepository } from '../repository/ResourceNodeRepository.js';
import { ResourceRepository } from '../repository/ResourceRepository.js';

@injectable()
export class ResourceNodeFactory {
	constructor(
		private readonly nodeRepository: ResourceNodeRepository,
		private readonly resourceRepository: ResourceRepository
	) {}

	create(name: string, type: ResourceNodeType, region: Region): ResourceNode {
		const node = this.nodeRepository.create({
			name,
			type,
			region: region.getId(),
		});

		Object.entries(ResourceNodeMapping[type]).forEach(([type, amount]) => {
			const resource = this.resourceRepository.create({
				type: type as ResourceType,
				amount,
			});

			node.addResource(resource);
		});

		region.addResourceNode(node);

		return node;
	}
}
