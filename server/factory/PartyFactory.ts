import { Party } from '../entity/Party.js';
import { Settlement } from '../entity/Settlement.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { SurvivorRepository } from '../repository/SurvivorRepository.js';
import { SurvivorType } from './SurvivorFactory.js';

export class PartyFactory {
	constructor(
		private readonly partyRepository: PartyRepository,
		private readonly survivorRepository: SurvivorRepository
	) {}

	public create(name: string, settlement: Settlement): Party {
		const party = this.partyRepository.create({
			name,
			settlement: settlement.getId(),
			survivors: [],
			inventory: [],
		});

		settlement.addParty(party);

		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager, party)
		);
		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager, party)
		);
		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager, party)
		);
		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager, party)
		);
		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager, party)
		);

		return party;
	}
}
