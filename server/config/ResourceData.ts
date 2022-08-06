export enum ResourceNodeType {
	Tower = 'Tower',
	Ruin = 'Ruin',
	Forest = 'Forest',
	Mountain = 'Mountain',
}

export enum ResourceType {
	wood = 'wood',
	stone = 'stone',
	iron = 'iron',
}

export const ResourceNodeMapping: {
	[key in ResourceNodeType]: { [key in ResourceType]?: number };
} = {
	[ResourceNodeType.Mountain]: {
		[ResourceType.stone]: 100000,
		[ResourceType.iron]: 10000,
	},
	[ResourceNodeType.Forest]: {
		[ResourceType.wood]: 10000,
		[ResourceType.stone]: 1000,
	},
	[ResourceNodeType.Ruin]: {
		[ResourceType.stone]: 6000,
		[ResourceType.iron]: 1000,
		[ResourceType.wood]: 4000,
	},
	[ResourceNodeType.Tower]: {
		[ResourceType.stone]: 50000,
		[ResourceType.iron]: 50000,
		[ResourceType.wood]: 50000,
	},
};
