import { container } from 'tsyringe';
import { World } from '../entity/World.js';
import { VoyageRepository } from '../repository/VoyageRepository.js';

export class WorldController {
	private readonly voyageRepository = container.resolve(VoyageRepository);

	//TODO rename?
	constructor(private readonly world: World) {}

	async tick(): Promise<void> {
		const now = new Date();
		this.voyageRepository.getAll().forEach((voyage) => {
			if (voyage.handled || voyage.arrivalAt > now) {
				return;
			}

			const party = voyage.getParty();
			party.setSettlement(voyage.getTarget());
			party.setVoyage(null);

			voyage.handled = true;

			//TODO send notification?
		});

		// console.log(
		// 	'Starting tick for ' + this.world.getId() + ' at ' + Date.now()
		// );
		// const result = await this.resolveAfter2Seconds();
		// console.log(result);
	}

	async resolveAfter2Seconds() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(
					'resolved tick for ' +
						this.world.getId() +
						' at ' +
						Date.now()
				);
			}, 2000);
		});
	}
}
