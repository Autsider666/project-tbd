import { SocketId } from 'socket.io-adapter';
import { ClientController } from './ClientController.js';
import { World } from '../entity/World.js';
import { WorldController } from './WorldController.js';
import { Server, Socket } from 'socket.io';
import { ServerState } from '../ServerState.js';

const EVENTS = {
	CLIENT: {
		CONNECTION: 'connection',
		SEND_MESSAGE: 'message',
	},
	SERVER: {
		SEND_MESSAGE: 'message',
	},
};

export class ServerController {
	private worldControllers: WorldController[] = [];
	private clientControllers = new Map<SocketId, ClientController>();

	constructor(
		protected readonly io: Server,
		protected readonly serverState: ServerState
	) {}

	async start(): Promise<void> {
		console.info(`Sockets enabled`);

		this.io.on(EVENTS.CLIENT.CONNECTION, (socket: Socket) => {
			this.clientControllers.set(
				socket.id,
				new ClientController(socket, this.io)
			);

			socket.on(EVENTS.CLIENT.SEND_MESSAGE, (message: any) => {
				console.log('Received message:', message);

				socket.emit(EVENTS.SERVER.SEND_MESSAGE, 'Message received.');

				socket.broadcast.emit(EVENTS.SERVER.SEND_MESSAGE, message);
			});

			socket.on('disconnect', () => {
				this.clientControllers.delete(socket.id);
			});
		});

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
			console.log('Turn ' + turn++ + ' at ' + Date.now());
			for (const [key, value] of Object.entries(process.memoryUsage())) {
				console.log(`Memory usage by ${key}, ${value / 1000000}MB `);
			}

			this.worldControllers.forEach((world) => world.tick());
		}, 5000);
	}
}
