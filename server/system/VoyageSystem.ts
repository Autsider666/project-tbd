import { singleton } from 'tsyringe';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { VoyageRepository } from '../repository/VoyageRepository.js';
import { System } from './System.js';

@singleton()
export class VoyageSystem implements System {
	constructor(private readonly voyageRepository: VoyageRepository) {}

	async tick(now: Date): Promise<void> {
		for (const voyage of await this.voyageRepository.getAll()) {
			if (voyage.finished || voyage.arrivalAt > now) {
				return;
			}

			const party = await voyage.getParty();
			const target = await voyage.getTarget();
			await party.setSettlement(target);
			await party.setVoyage(null);

			voyage.finished = true;

			ClientNotifier.success(
				`Party "${party.name}" has arrived at settlement "${target.name}".`,
				await party.getUpdateRoomName()
			);
		}
	}
}
