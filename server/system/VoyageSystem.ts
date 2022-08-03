import { singleton } from 'tsyringe';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { VoyageRepository } from '../repository/VoyageRepository.js';
import { System } from './System.js';

@singleton()
export class VoyageSystem implements System {
	constructor(private readonly voyageRepository: VoyageRepository) {}

	tick(now: Date): void {
		this.voyageRepository.getAll().forEach((voyage) => {
			if (voyage.finished || voyage.arrivalAt > now) {
				return;
			}

			const party = voyage.getParty();
			const target = voyage.getTarget();
			party.setSettlement(target);
			party.setVoyage(null);

			voyage.finished = true;

			ClientNotifier.success(
				`Party "${party.name}" has arrived at settlement "${target.name}".`,
				party.getUpdateRoomName()
			);
		});
	}
}
