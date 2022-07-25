import { Party } from '../entity/Party.js';
import { SettlementId } from '../entity/Settlement.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { SurvivorRepository } from '../repository/SurvivorRepository.js';
import { SurvivorType } from './SurvivorFactory.js';

export class PartyFactory {
	constructor(
		private readonly partyRepository: PartyRepository,
		private readonly survivorRepository: SurvivorRepository
	) {}

	public create(name: string, settlement: SettlementId): Party {
		const party = this.partyRepository.create({
			name,
			settlement,
			survivors: [],
			inventory: [],
			currentTravelEvent: null,
		});

		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager)
		);
		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager)
		);
		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager)
		);
		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager)
		);
		party.addSurvivor(
			this.survivorRepository.createType(SurvivorType.villager)
		);

		return party;
	}
}
