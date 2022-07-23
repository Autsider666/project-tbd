import { SocketId } from 'socket.io-adapter';
import { Character } from '../entity/Character.js';
import { CharacterRepository } from '../repository/CharacterRepository.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';
import { ClientController } from './ClientController.js';
import { World } from '../entity/World.js';
import { StateSyncController } from './StateSyncController.js';
import { WorldController } from './WorldController.js';
import { Server, Socket } from 'socket.io';
import { ServerState } from '../ServerState.js';

export class ServerController {
	private worldControllers: WorldController[] = [];
	private clientControllers = new Map<SocketId, ClientController>();
	private stateSyncController: StateSyncController;

	constructor(
		protected readonly io: Server<
			ClientToServerEvents,
			ServerToClientEvents
		>,
		protected readonly serverState: ServerState
	) {
		this.stateSyncController = new StateSyncController(serverState, io);
	}

	async start(): Promise<void> {
		console.info(`Sockets enabled`);

		this.io.on(
			'connection',
			(
				socket: Socket<
					ClientToServerEvents,
					ServerToClientEvents,
					any,
					SocketData
				>
			) => {
				this.clientControllers.set(
					socket.id,
					new ClientController(
						socket,
						this.io,
						this.serverState.getRepository(
							Character
						) as CharacterRepository
					)
				);

				socket.on('disconnect', (reason) => {
					this.clientControllers.delete(socket.id);
				});
			}
		);

		this.serverState
			.getRepository(World)
			?.getAll()
			.forEach((world) =>
				this.worldControllers.push(
					new WorldController(world, this.serverState, this.io)
				)
			);

		let turn = 0;
		setInterval(() => {
			// console.log('Turn ' + turn++ + ' at ' + Date.now());
			// for (const [key, value] of Object.entries(process.memoryUsage())) {
			// 	console.log(`Memory usage by ${key}, ${value / 1000000}MB `);
			// }

			this.worldControllers.forEach((world) => world.tick());
		}, 5000);
	}
}
