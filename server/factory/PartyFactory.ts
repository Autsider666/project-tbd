import { injectable } from 'tsyringe';
import { Survivor } from '../config/SurvivorData.js';
import { Party } from '../entity/Party.js';
import { Settlement } from '../entity/Settlement.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { SurvivorFactory } from './SurvivorFactory.js';

@injectable()
export class PartyFactory {
	constructor(
		private readonly partyRepository: PartyRepository,
		private readonly survivorFactory: SurvivorFactory
	) {}

	public create(name: string, settlement: Settlement): Party {
		const party = this.partyRepository.create({
			name,
			settlement: settlement.getId(),
		});

		settlement.addParty(party);

		party.addSurvivor(this.survivorFactory.create(Survivor.Villager));
		party.addSurvivor(this.survivorFactory.create(Survivor.Villager));
		party.addSurvivor(this.survivorFactory.create(Survivor.Villager));
		party.addSurvivor(this.survivorFactory.create(Survivor.Villager));
		party.addSurvivor(this.survivorFactory.create(Survivor.Villager));

		return party;
	}
}
