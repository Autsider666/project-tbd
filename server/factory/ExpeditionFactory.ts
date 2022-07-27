import { injectable } from 'tsyringe';
import { Expedition, ExpeditionPhase } from '../entity/Expedition.js';
import { Party } from '../entity/Party.js';
import { ResourceNode } from '../entity/ResourceNode.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';

@injectable()
export class ExpeditionFactory {
	constructor(private readonly expeditionRepository: ExpeditionRepository) {}

	public create(party: Party, node: ResourceNode): Expedition {
		if (party.getVoyage() !== null) {
			throw new Error('Party is already traveling to another city.');
		}

		if (party.getExpedition() !== null) {
			throw new Error('Party is already on an expedition.');
		}

		const durationInSeconds = 5;
		const startedAt = new Date();
		const nextPhaseAt = new Date(
			startedAt.getTime() + durationInSeconds * 1000
		);

		const expedition = this.expeditionRepository.create({
			party: party.getId(),
			phase: ExpeditionPhase.travel,
			origin: party.getSettlement().getId(),
			target: node.getId(),
			startedAt,
			nextPhaseAt,
		});

		if (!party.setExpedition(expedition)) {
			this.expeditionRepository.removeEntity(expedition.getId());
			throw new Error('Could not add expedition to party');
		}

		return expedition;
	}
}
