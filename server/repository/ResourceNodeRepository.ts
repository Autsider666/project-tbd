import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import {
	ResourceNode,
	ResourceNodeStateData,
	ResourceNodeId,
} from '../entity/ResourceNode.js';
import { Repository } from './Repository.js';

@singleton()
@registry([{ token: 'Repository', useValue: ResourceNodeRepository }])
export class ResourceNodeRepository extends Repository<
	ResourceNode,
	ResourceNodeId,
	ResourceNodeStateData
> {
	protected entity(): Constructor<ResourceNode> {
		return ResourceNode;
	}
}
