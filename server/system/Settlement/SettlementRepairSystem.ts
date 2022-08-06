import { singleton } from 'tsyringe';
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
					!settlement.destroyed &&
					settlement.upgrade === null
			)) {
			const idleSurvivors = settlement.getSurvivors();
			for (const party of settlement
				.getParties()
				.filter(
					(party) =>
						party.getVoyage() === null &&
						party.getExpedition() === null
				)) {
				idleSurvivors.push(...party.getSurvivors());
			}

			let availableWork = 0;
			for (const survivor of idleSurvivors) {
				availableWork += SurvivorDataMap[survivor].stats.gatheringSpeed;
			}

			const workDone = Math.min(availableWork, settlement.damageTaken);
			settlement.damageTaken -= workDone;
		}
	}
}
