import { Resource, ResourceType } from '../Resource.js';

export interface ResourceContainer {
	addResource(amount: number, type: ResourceType): void;

	removeResource(resource: Resource): void;

	// transferResourceTo(
	// 	resource: Resource,
	// 	newContainer: ResourceContainer
	// ): void;

	// getEntityRoomName(): string;
}
