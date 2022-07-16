import { World } from './entity/World.js';
import { ServerState } from '../ServerState.js';

export class WorldController {
	constructor(
		private readonly world: World,
		private readonly serverState: ServerState
	) {}

	async tick(): Promise<void> {
		console.log('Starting tick for ' + this.world.id + ' at ' + Date.now());
		const result = await this.resolveAfter2Seconds();
		console.log(result);
	}

	async resolveAfter2Seconds() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(
					'resolved tick for ' + this.world.id + ' at ' + Date.now()
				);
			}, 2000);
		});
	}
}
