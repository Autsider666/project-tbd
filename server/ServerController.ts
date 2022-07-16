import { World } from './game/entity/World.js';
import { WorldController } from './game/WorldController.js';
import { Server, Socket } from 'socket.io';
import { ServerState } from './ServerState.js';

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

	constructor(
		protected readonly io: Server,
		protected readonly serverState: ServerState
	) {}

	async start(): Promise<void> {
		console.info(`Sockets enabled`);

		this.io.on(EVENTS.CLIENT.CONNECTION, (socket: Socket) => {
			console.info(`User connected ${socket.id}`);

			socket.on(EVENTS.CLIENT.SEND_MESSAGE, (message: any) => {
				console.log('Received message:', message);

				socket.emit(EVENTS.SERVER.SEND_MESSAGE, 'Message received.');

				socket.broadcast.emit(EVENTS.SERVER.SEND_MESSAGE, message);
			});
		});

		this.serverState
			.getRepository(World)
			?.getAll()
			.forEach((world) =>
				this.worldControllers.push(
					new WorldController(world, this.serverState)
				)
			);

		let turn = 0;
		setInterval(() => {
			console.log('Turn ' + turn++ + ' at ' + Date.now());

			this.worldControllers.forEach((world) => world.tick());
		}, 5000);
	}
}
