import { read } from 'fs';
import { Server, Socket } from 'socket.io';
import { ResourceContainer } from '../entity/CommonTypes/ResourceContainer.js';
import { SurvivorContainer } from '../entity/CommonTypes/SurvivorContainer.js';
import { PartyId } from '../entity/Party.js';
import { SettlementId } from '../entity/Settlement.js';
import { SurvivorFactory } from '../factory/SurvivorFactory.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { SettlementRepository } from '../repository/SettlementRepository.js';
import { SurvivorRepository } from '../repository/SurvivorRepository.js';
import { ServerConfig } from '../serverConfig.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';

export class TestController {
	constructor(
		private readonly config: ServerConfig,
		private readonly io: Server,
		private readonly survivorFactory: SurvivorFactory,
		private readonly settlementRepository: SettlementRepository,
		private readonly partyRepository: PartyRepository,
		private readonly survivorRepository: SurvivorRepository
	) {}

	async start() {
		if (this.config.get('env') !== 'dev') {
			return;
		}

		this.io.on(
			'connect',
			(
				socket: Socket<
					ClientToServerEvents,
					ServerToClientEvents,
					any,
					SocketData
				>
			) => {
				socket.on('test:survivor:add', ({ containerId, template }) => {
					let container: SurvivorContainer | null =
						this.settlementRepository.get(
							containerId as SettlementId
						);
					if (container === null) {
						container = this.partyRepository.get(
							containerId as PartyId
						);
					}

					if (container === null) {
						return;
					}

					this.survivorFactory.create(template, container);
				});

				socket.on('test:survivor:remove', ({ survivorId }) => {
					let survivor = this.survivorRepository.get(survivorId);
					if (survivor === null) {
						return;
					}

					survivor.owner?.removeSurvivor(survivor);
					this.survivorRepository.removeEntity(survivor.getId());
				});

				socket.on(
					'test:resource:add',
					({ containerId, amount, resource }) => {
						let container: ResourceContainer | null =
							this.settlementRepository.get(
								containerId as SettlementId
							);
						if (container === null) {
							container = this.partyRepository.get(
								containerId as PartyId
							);
						}

						if (container === null) {
							return;
						}

						container.addResource(amount, resource);
					}
				);
			}
		);
	}
}
