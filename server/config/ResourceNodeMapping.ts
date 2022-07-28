import { ResourceType } from '../entity/Resource.js';
import { ResourceNodeType } from '../entity/ResourceNode.js';

export const ResourceNodeMapping: {
	[key in ResourceNodeType]: { [key in ResourceType]?: number };
} = {
	[ResourceNodeType.Mountain]: {
		[ResourceType.stone]: 100,
		[ResourceType.iron]: 10,
	},
	[ResourceNodeType.Forest]: {
		[ResourceType.wood]: 100,
		[ResourceType.stone]: 10,
	},
	[ResourceNodeType.Ruin]: {
		[ResourceType.stone]: 60,
		[ResourceType.iron]: 10,
		[ResourceType.wood]: 40,
	},
	[ResourceNodeType.Tower]: {
		[ResourceType.stone]: 500,
		[ResourceType.iron]: 500,
		[ResourceType.wood]: 500,
	},
};
