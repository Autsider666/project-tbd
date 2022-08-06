import { Survivor } from '../../config/SurvivorData.js';

export interface SurvivorContainer {
	addSurvivor(survivor: Survivor): void;

	removeSurvivor(survivor: Survivor): boolean;

	transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	): void;

	getEntityRoomName(): string;
}
