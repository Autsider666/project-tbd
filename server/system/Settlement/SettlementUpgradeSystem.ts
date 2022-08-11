import { singleton } from 'tsyringe';
import { SurvivorDataMap } from '../../config/SurvivorData.js';
import { SettlementUpgrade } from '../../entity/Settlement.js';
import { SettlementRepository } from '../../repository/SettlementRepository.js';
import { System } from '../System.js';

@singleton()
export class SettlementUpgradeSystem implements System {
	constructor(private readonly settlementRepository: SettlementRepository) {}

	tick(now: Date): void {
		for (const settlement of this.settlementRepository
			.getAll()
			.filter(
				(settlement) =>
					!settlement.destroyed &&
					settlement.raid === null &&
					settlement.upgrade !== null
			)) {
			let availableWork = 0;
			for (const survivor of settlement.getIdleSurvivors()) {
				availableWork += SurvivorDataMap[survivor].stats.gatheringSpeed;
			}

			const project = settlement.upgrade as SettlementUpgrade;

			const workDone = Math.min(availableWork, project.remainingWork);

			project.remainingWork -= workDone;
			if (project.remainingWork > 0) {
				return;
			}

			settlement.upgradeBuilding(project.type);
			settlement.upgrade = null;
		}
	}
}
