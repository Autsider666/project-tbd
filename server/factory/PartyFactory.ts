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

	public async create(name: string, settlement: Settlement): Promise<Party> {
		const party = await this.partyRepository.create({
			name,
			settlement: settlement.getId(),
		});

		await settlement.addParty(party);

		party.addSurvivor(
			await this.survivorFactory.create(SurvivorType.villager, party)
		);
		party.addSurvivor(
			await this.survivorFactory.create(SurvivorType.villager, party)
		);
		party.addSurvivor(
			await this.survivorFactory.create(SurvivorType.villager, party)
		);
		party.addSurvivor(
			await this.survivorFactory.create(SurvivorType.villager, party)
		);
		party.addSurvivor(
			await this.survivorFactory.create(SurvivorType.villager, party)
		);

		return party;
	}
}
