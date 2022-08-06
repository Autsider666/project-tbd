import { ResourceType } from '../../config/ResourceData.js';

export type Resources = { [key in ResourceType]: number };

export const generateEmptyResourcesObject = (): Resources => ({
	[ResourceType.iron]: 0,
	[ResourceType.stone]: 0,
	[ResourceType.wood]: 0,
});

export interface ResourceContainer {
	addResource(amount: number, type: ResourceType): void;

	removeResource(amount: number, type: ResourceType): boolean;

	// transferResourceTo(
	// 	resource: Resource,
	// 	newContainer: ResourceContainer
	// ): void;

	// getEntityRoomName(): string;
}
