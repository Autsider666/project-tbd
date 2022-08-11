import { singleton } from 'tsyringe';
import { ResourceType } from '../../config/ResourceData.js';
import { SurvivorDataMap } from '../../config/SurvivorData.js';
import { SettlementRepository } from '../../repository/SettlementRepository.js';
import { System } from '../System.js';

@singleton()
export class SettlementRepairSystem implements System {
	constructor(private readonly settlementRepository: SettlementRepository) {}

	tick(now: Date): void {
		for (const settlement of this.settlementRepository
			.getAll()
			.filter(
				(settlement) =>
					!settlement.destroyedAt && settlement.raid === null
			)) {
			let availableWork = 0;
			for (const survivor of settlement.getIdleSurvivors()) {
				availableWork += SurvivorDataMap[survivor].stats.gatheringSpeed;
			}

			const workDone = Math.min(
				availableWork,
				settlement.damageTaken,
				settlement.getResource(ResourceType.wood)
			);
			settlement.damageTaken -= workDone;
			settlement.removeResource(workDone, ResourceType.wood);
		}
	}
}
