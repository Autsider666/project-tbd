import { ResourceType } from '../Resource.js';

export interface ResourceContainer {
	addResource(amount: number, type: ResourceType): void;

	removeResource(amount: number, type: ResourceType): void;

	// transferResourceTo(
	// 	resource: Resource,
	// 	newContainer: ResourceContainer
	// ): void;

	// getEntityRoomName(): string;
}
