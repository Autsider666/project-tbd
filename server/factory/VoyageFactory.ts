import { Party } from '../entity/Party.js';
import { Settlement } from '../entity/Settlement.js';
import { Voyage } from '../entity/Voyage.js';
import { VoyageRepository } from '../repository/VoyageRepository.js';

export class VoyageFactory {
	constructor(protected readonly voyageRepository: VoyageRepository) {}

	public create(party: Party, target: Settlement): Voyage {
		if (party.getVoyage() !== null) {
			throw new Error(
				"Can't create a voyage for a party that's already traveling"
			);
		}

		if (
			party.getSettlement().getUpdateRoomName() !==
			target.getUpdateRoomName()
		) {
			throw new Error("Target settlement isn't in the same world.");
		}

		const duration = 1;
		const startedAt = new Date();
		const arrivalAt = new Date(startedAt.getTime() + duration * 60000);

		const voyage = this.voyageRepository.create({
			party: party.getId(),
			origin: party.getSettlement().getId(),
			target: target.getId(),
			startedAt,
			arrivalAt,
			handled: false,
		});

		if (!party.setVoyage(voyage)) {
			throw new Error('Could not add voyage to party');
		}

		return voyage;
	}
}
