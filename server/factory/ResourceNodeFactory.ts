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

	async create(
		name: string,
		type: ResourceNodeType,
		region: Region
	): Promise<ResourceNode> {
		const node = await this.nodeRepository.create({
			name,
			type,
			region: region.getId(),
		});

		for (const [mappedType, amount] of Object.entries(
			ResourceNodeMapping[type]
		)) {
			const resource = await this.resourceRepository.create({
				type: mappedType as ResourceType,
				amount,
			});
			console.log(99999, resource);
			await node.addResource(resource);
		}

		await region.addResourceNode(node);

		return node;
	}
}
