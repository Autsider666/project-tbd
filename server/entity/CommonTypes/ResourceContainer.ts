import { ResourceType } from '../../config/ResourceData.js';

export type Resources = { [key in ResourceType as string]?: number };

export interface ResourceContainer {
	addResource(amount: number, type: ResourceType): void;

	removeResource(amount: number, type: ResourceType): boolean;

	// transferResourceTo(
	// 	resource: Resource,
	// 	newContainer: ResourceContainer
	// ): void;

	// getEntityRoomName(): string;
}
