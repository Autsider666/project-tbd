import { injectable } from 'tsyringe';
import { Party } from '../entity/Party.js';
import { Settlement } from '../entity/Settlement.js';
import { Voyage } from '../entity/Voyage.js';
import { TravelTimeCalculator } from '../helper/TravelTimeCalculator.js';
import { VoyageRepository } from '../repository/VoyageRepository.js';

@injectable()
export class VoyageFactory {
	constructor(
		protected readonly voyageRepository: VoyageRepository,
		private readonly travelTimeCalculator: TravelTimeCalculator
	) {}

	public async create(party: Party, target: Settlement): Promise<Voyage> {
		if ((await party.getVoyage()) !== null) {
			throw new Error(
				"Can't create a voyage for a party that's already traveling"
			);
		}

		if (
			(await (await party.getSettlement()).getUpdateRoomName()) !==
			(await target.getUpdateRoomName())
		) {
			throw new Error("Target settlement isn't in the same world.");
		}

		const durationInSeconds =
			(
				await this.travelTimeCalculator.calculateTravelTime(
					await (await party.getSettlement()).getRegion(),
					await target.getRegion()
				)
			)?.cost ?? null;
		if (durationInSeconds === null) {
			throw new Error('Could not find a route to target settlement.');
		}

		const startedAt = new Date();
		const arrivalAt = new Date(
			startedAt.getTime() + durationInSeconds * 1000
		);

		const voyage = await this.voyageRepository.create({
			party: party.getId(),
			origin: (await party.getSettlement()).getId(),
			target: target.getId(),
			startedAt,
			arrivalAt,
			finished: false,
		});

		if (!(await party.setVoyage(voyage))) {
			this.voyageRepository.removeEntity(voyage.getId());
			throw new Error('Could not add voyage to party');
		}

		return voyage;
	}
}
