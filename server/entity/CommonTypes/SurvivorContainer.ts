import { Survivor } from '../Survivor.js';

export interface SurvivorContainer {
	addSurvivor(survivor: Survivor): void;

	removeSurvivor(survivor: Survivor): void;

	transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	): void;

	getEntityRoomName(): string;
}
