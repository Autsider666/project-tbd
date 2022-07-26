import { Server } from 'socket.io';
import { Voyage } from '../entity/Voyage.js';
import { World } from '../entity/World.js';
import { ServerState } from '../ServerState.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';

export class WorldController {
	//TODO rename?
	constructor(
		private readonly world: World,
		private readonly serverState: ServerState,
		private readonly io: Server<
			ClientToServerEvents,
			ServerToClientEvents,
			any,
			SocketData
		>
	) {}

	async tick(): Promise<void> {
		const now = new Date();
		this.serverState
			.getRepository(Voyage)
			.getAll()
			.forEach((voyage) => {
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
