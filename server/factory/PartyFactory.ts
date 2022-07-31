import { injectable } from 'tsyringe';
import { Party } from '../entity/Party.js';
import { Settlement } from '../entity/Settlement.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { SurvivorRepository } from '../repository/SurvivorRepository.js';
import { SurvivorFactory, SurvivorType } from './SurvivorFactory.js';

@injectable()
export class PartyFactory {
	constructor(
		private readonly partyRepository: PartyRepository,
		private readonly survivorRepository: SurvivorRepository,
		private readonly survivorFactory: SurvivorFactory
	) {}

	public create(name: string, settlement: Settlement): Party {
		const party = this.partyRepository.create({
			name,
			settlement: settlement.getId(),
		});

		settlement.addParty(party);

		party.addSurvivor(
			this.survivorFactory.create(SurvivorType.villager, party)
		);
		party.addSurvivor(
			this.survivorFactory.create(SurvivorType.villager, party)
		);
		party.addSurvivor(
			this.survivorFactory.create(SurvivorType.villager, party)
		);
		party.addSurvivor(
			this.survivorFactory.create(SurvivorType.villager, party)
		);
		party.addSurvivor(
			this.survivorFactory.create(SurvivorType.villager, party)
		);

		return party;
	}
}
