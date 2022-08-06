import { Server, Socket } from 'socket.io';
import { injectable } from 'tsyringe';
import { Survivor } from '../config/SurvivorData.js';
import { ResourceContainer } from '../entity/CommonTypes/ResourceContainer.js';
import { SurvivorContainer } from '../entity/CommonTypes/SurvivorContainer.js';
import { PartyId } from '../entity/Party.js';
import { SettlementId } from '../entity/Settlement.js';
import { SurvivorFactory } from '../factory/SurvivorFactory.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { SettlementRepository } from '../repository/SettlementRepository.js';
import { ServerConfig } from '../serverConfig.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';

@injectable()
export class TestController {
	constructor(
		private readonly config: ServerConfig,
		private readonly io: Server,
		private readonly survivorFactory: SurvivorFactory,
		private readonly settlementRepository: SettlementRepository,
		private readonly partyRepository: PartyRepository
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
				socket.on(
					'test:survivor:add',
					({ containerId, type = Survivor.Villager }) => {
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

						container.addSurvivor(type);
					}
				);

				socket.on('test:survivor:remove', ({ containerId, type }) => {
					if (!(type in Survivor)) {
						return;
					}

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

					container.removeSurvivor(type);
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

				socket.on(
					'test:raid:start',
					({
						settlementId,
						enemy = {
							name: 'a horde of 42 zombies',
							hp: 1000,
							damage: 50,
							damageTaken: 0,
						},
					}) => {
						const settlement =
							this.settlementRepository.get(settlementId);
						if (!settlement) {
							return;
						}

						settlement.raid = enemy;
					}
				);

				socket.on('test:raid:stop', ({ settlementId }) => {
					const settlement =
						this.settlementRepository.get(settlementId);
					if (!settlement) {
						return;
					}

					settlement.raid = null;
				});
			}
		);
	}
}
