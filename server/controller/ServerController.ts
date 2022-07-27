import { SocketId } from 'socket.io-adapter';
import { injectable } from 'tsyringe';
import { WorldRepository } from '../repository/WorldRepository.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';
import { ClientController } from './ClientController.js';
import { WorldController } from './WorldController.js';
import { Server, Socket } from 'socket.io';

@injectable()
export class ServerController {
	private readonly worldControllers: WorldController[] = [];
	private readonly clientControllers = new Map<SocketId, ClientController>();

	constructor(
		protected readonly io: Server,
		private readonly worldRepository: WorldRepository
	) {}

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
					new ClientController(socket)
				);

				socket.on('disconnect', (reason) => {
					this.clientControllers.delete(socket.id);
				});
			}
		);

		this.worldRepository
			.getAll()
			.forEach((world) =>
				this.worldControllers.push(new WorldController(world))
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
