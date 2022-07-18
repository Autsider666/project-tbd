import { Server } from 'socket.io';
import { World } from './entity/World.js';
import { ServerState } from '../ServerState.js';

export class WorldController {
	constructor(
		private readonly world: World,
		private readonly serverState: ServerState,
		private readonly io: Server
	) {
		const repository = this.serverState.getRepository(World);
		if (!repository) {
			throw new Error(
				'WorldRepository is not registered to ServerState.'
			);
		}

		repository.registerOnChangeCallback(world, this.handleWorldChange);

		this.io.of('/').adapter.on('join-room', (room, id) => {
			console.log(`socket ${id} has joined room ${room}`);
		});
	}

	async tick(): Promise<void> {
		console.log('Starting tick for ' + this.world.id + ' at ' + Date.now());
		// const result = await this.resolveAfter2Seconds();
		// console.log(result);
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

	handleWorldChange(
		world: World,
		path: string,
		value: any,
		previousValue: any
	): void {
		console.log(world.name, path, value, previousValue);
	}
}
