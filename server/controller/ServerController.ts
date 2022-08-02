import { SocketId } from 'socket.io-adapter';
import { injectable, injectAll, registry } from 'tsyringe';
import { ExpeditionPhase } from '../entity/Expedition.js';
import { ServerConfig } from '../serverConfig.js';
import { WorldFactory } from '../factory/WorldFactory.js';
import { StatePersister } from '../helper/StatePersister.js';
import { WorldRepository } from '../repository/WorldRepository.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';
import { ExpeditionGatheringSystem } from '../system/ExpeditionGatheringSystem.js';
import { ExpeditionPhaseSystem } from '../system/ExpeditionPhaseSystem.js';
import { ExpeditionRecruitmentSystem } from '../system/ExpeditionRecruitmentSystem.js';
import { StatusLoggerSystem } from '../system/StatusLoggerSystem.js';
import { System } from '../system/System.js';
import { VoyageSystem } from '../system/VoyageSystem.js';
import { WorldTimestampSystem } from '../system/WorldTimestampSystem.js';
import { ClientController } from './ClientController.js';
import { Server, Socket } from 'socket.io';

// TODO move to config file?
@registry([
	{ token: 'System', useClass: VoyageSystem },
	{ token: 'System', useClass: ExpeditionGatheringSystem },
	{ token: 'System', useClass: ExpeditionPhaseSystem },
	{ token: 'System', useClass: ExpeditionRecruitmentSystem },
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
		private readonly worldFactory: WorldFactory,
		private readonly config: ServerConfig
	) {}

	async start(): Promise<void> {
		await StatePersister.readState();
		if (this.worldRepository.getAll().length === 0) {
			console.log('Creating world!');
			await this.worldFactory.create();
			await StatePersister.writeState();
		}

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
			const now = new Date();
			this.systems.forEach(async (system) => system.tick(now));
		}, this.config.get('serverTickTime'));
	}
}
