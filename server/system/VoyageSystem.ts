import { singleton } from 'tsyringe';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { VoyageRepository } from '../repository/VoyageRepository.js';
import { System } from './System.js';

@singleton()
export class VoyageSystem implements System {
	constructor(private readonly voyageRepository: VoyageRepository) {}

	async tick(): Promise<void> {
		const now = new Date();
		this.voyageRepository.getAll().forEach((voyage) => {
			if (voyage.handled || voyage.arrivalAt > now) {
				return;
			}

			const party = voyage.getParty();
			const target = voyage.getTarget();
			party.setSettlement(target);
			party.setVoyage(null);

			voyage.handled = true;

			ClientNotifier.success(
				`Party "${party.name}" has arrived at settlement "${target.name}".`,
				party.getUpdateRoomName()
			);
		});
	}
}
