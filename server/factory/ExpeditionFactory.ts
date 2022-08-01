import { injectable } from 'tsyringe';
import { Expedition, ExpeditionPhase } from '../entity/Expedition.js';
import { Party } from '../entity/Party.js';
import { ResourceNode } from '../entity/ResourceNode.js';
import { TravelTimeCalculator } from '../helper/TravelTimeCalculator.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';

@injectable()
export class ExpeditionFactory {
	constructor(
		private readonly expeditionRepository: ExpeditionRepository,
		private readonly travelTimeCalculator: TravelTimeCalculator
	) {}

	public async create(party: Party, node: ResourceNode): Promise<Expedition> {
		if ((await party.getVoyage()) !== null) {
			throw new Error('Party is already traveling to another city.');
		}

		if ((await party.getExpedition()) !== null) {
			throw new Error('Party is already on an expedition.');
		}

		const durationInSeconds =
			(
				await this.travelTimeCalculator.calculateTravelTime(
					await (await party.getSettlement()).getRegion(),
					await node.getRegion()
				)
			)?.cost ?? null;
		if (durationInSeconds === null) {
			throw new Error('Could not find a route to target resource node.');
		}
		const startedAt = new Date();
		const nextPhaseAt = new Date(
			startedAt.getTime() + durationInSeconds * 1000
		);

		const expedition = await this.expeditionRepository.create({
			party: party.getId(),
			phase: ExpeditionPhase.travel,
			origin: (await party.getSettlement()).getId(),
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
