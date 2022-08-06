import { singleton } from 'tsyringe';
import { PartyRepository } from '../repository/PartyRepository.js';
import { ServerConfig } from '../serverConfig.js';
import { System } from './System.js';

@singleton()
export class IncrementalEnergySystem implements System {
	constructor(
		private readonly partyRepository: PartyRepository,
		private readonly config: ServerConfig
	) {}

	tick(now: Date): void {
		const maxEnergy = this.config.get('maxPartyEnergy');
		const activeParties = this.partyRepository
			.getAll()
			.filter((party) => !party.dead && party.energy < maxEnergy);
		for (const party of activeParties) {
			party.energy++;
		}
	}
}
