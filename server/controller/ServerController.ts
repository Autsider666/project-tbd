import { SocketId } from 'socket.io-adapter';
import { injectable, injectAll, registry } from 'tsyringe';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';
import { ExpeditionSystem } from '../system/ExpeditionSystem.js';
import { StatusLoggerSystem } from '../system/StatusLoggerSystem.js';
import { System } from '../system/System.js';
import { VoyageSystem } from '../system/VoyageSystem.js';
import { ClientController } from './ClientController.js';
import { Server, Socket } from 'socket.io';

export const ServerTickTime = 5000;

// TODO move to config file?
@registry([
	{ token: 'System', useClass: VoyageSystem },
	{ token: 'System', useClass: ExpeditionSystem },
	{ token: 'System', useClass: StatusLoggerSystem },
])
@injectable()
export class ServerController {
	private readonly clientControllers = new Map<SocketId, ClientController>();

	constructor(
		protected readonly io: Server,
		@injectAll('System') protected readonly systems: System[]
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

		setInterval(() => {
			this.systems.forEach(async (system) => await system.tick());
		}, ServerTickTime);
	}
}
