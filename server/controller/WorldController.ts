import { Server } from 'socket.io';
import { SocketId } from 'socket.io-adapter';
import { World } from '../entity/World.js';
import { ServerState } from '../ServerState.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';

export class WorldController {
	constructor(
		private readonly world: World,
		private readonly serverState: ServerState,
		private readonly io: Server<
			ClientToServerEvents,
			ServerToClientEvents,
			any,
			SocketData
		>
	) {
		const repository = this.serverState.getRepository(World);

		repository.registerOnChangeCallback(world, this.handleWorldChange);

		this.io
			.of('/')
			.adapter.on('join-room', (room: string, id: SocketId) => {
				if (room === 'entity:' + world.getId()) {
				}
			});
	}

	async tick(): Promise<void> {
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

	handleWorldChange(
		world: World,
		path: string,
		value: any,
		previousValue: any
	): void {
		// console.log(world.name, path, value, previousValue);
	}
}
