import { SocketId } from 'socket.io-adapter';
import { injectable, injectAll, registry } from 'tsyringe';
import { WorldFactory } from '../factory/WorldFactory.js';
import { WorldRepository } from '../repository/WorldRepository.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';
import { ExpeditionSystem } from '../system/ExpeditionSystem.js';
import { StatusLoggerSystem } from '../system/StatusLoggerSystem.js';
import { System } from '../system/System.js';
import { VoyageSystem } from '../system/VoyageSystem.js';
import { WorldTimestampSystem } from '../system/WorldTimestampSystem.js';
import { ClientController } from './ClientController.js';
import { Server, Socket } from 'socket.io';

export const ServerTickTime = 5000;

// TODO move to config file?
@registry([
	{ token: 'System', useClass: VoyageSystem },
	{ token: 'System', useClass: ExpeditionSystem },
	{ token: 'System', useClass: StatusLoggerSystem },
	{ token: 'System', useClass: WorldTimestampSystem },
])
@injectable()
export class ServerController {
	private readonly clientControllers = new Map<SocketId, ClientController>();

	constructor(
		protected readonly io: Server,
		@injectAll('System') protected readonly systems: System[],
		private readonly worldRepository: WorldRepository,
		private readonly worldFactory: WorldFactory
	) {}

	async start(): Promise<void> {
		console.info(`Sockets enabled`);

		if ((await this.worldRepository.getAll()).length === 0) {
			console.log('Creating world!');
			await this.worldFactory.create();
		}

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
			const now = new Date();
			this.systems.forEach(async (system) => system.tick(now));
		}, ServerTickTime);
	}
}
