import { Survivor } from '../Survivor.js';

export interface SurvivorContainer {
	addSurvivor(survivor: Survivor): void;

	transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	): Promise<void>;

	getEntityRoomName(): string;
}
