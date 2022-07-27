import { injectable } from 'tsyringe';
import { Expedition, ExpeditionPhase } from '../entity/Expedition.js';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';
import { System } from './System.js';

@injectable()
export class ExpeditionSystem implements System {
	constructor(private readonly expeditionRepository: ExpeditionRepository) {}

	async tick(): Promise<void> {
		const now = new Date();
		this.expeditionRepository
			.getAll()
			.filter(
				(expedition) =>
					!expedition.finished && expedition.nextPhaseAt <= now
			)
			.forEach((expedition) => {
				switch (expedition.phase) {
					case ExpeditionPhase.gather:
						this.handleEndOfGathering(expedition);
						break;
					case ExpeditionPhase.travel:
						this.handleEndOfTravel(expedition);
						break;
					default:
						throw new Error('Should never happen'); //TODO
				}
			});
	}

	private handleEndOfGathering(expedition: Expedition): void {
		expedition.phase = ExpeditionPhase.travel;
		expedition.returning = true;

		const durationInSeconds = 5;
		const now = new Date();
		expedition.nextPhaseAt = new Date(
			now.getTime() + durationInSeconds * 1000
		);

		const party = expedition.getParty();
		const target = expedition.getTarget();
		ClientNotifier.success(
			`Party "${party.name}" finished gathering at ${target.name} and are on their way back home.`,
			party.getUpdateRoomName()
		);
	}

	private handleEndOfTravel(expedition: Expedition): void {
		const party = expedition.getParty();
		const target = expedition.getTarget();
		if (expedition.returning) {
			party.setExpedition(null);
			expedition.finished = true;

			ClientNotifier.success(
				`Party "${party.name}" returned from their expedition to ${target.name}.`,
				party.getUpdateRoomName()
			);

			return;
		}

		expedition.phase = ExpeditionPhase.gather;

		const durationInSeconds = 5;
		const now = new Date();
		expedition.nextPhaseAt = new Date(
			now.getTime() + durationInSeconds * 1000
		);

		ClientNotifier.success(
			`Party "${party.name}" arrived at ${target.name} and will start to gather.`,
			party.getUpdateRoomName()
		);
	}
}
