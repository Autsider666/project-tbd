import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';
import { Party, PartyId } from '../entity/Party.js';
import {
	Settlement,
	SettlementClientData,
	SettlementId,
} from '../entity/Settlement.js';
import { WorldId } from '../entity/World.js';
import { ExpeditionFactory } from '../factory/ExpeditionFactory.js';
import { PartyFactory } from '../factory/PartyFactory.js';
import { VoyageFactory } from '../factory/VoyageFactory.js';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { TravelTimeCalculator } from '../helper/TravelTimeCalculator.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { RegionRepository } from '../repository/RegionRepository.js';
import { ResourceNodeRepository } from '../repository/ResourceNodeRepository.js';
import { SettlementRepository } from '../repository/SettlementRepository.js';
import { WorldRepository } from '../repository/WorldRepository.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';

const secret = 'CHANGE ME QUICK!'; //TODO I mean it!

type PartyPayload = {
	party: PartyId;
	world: WorldId;
};

export class Client {
	public readonly parties = new Map<PartyId, Party>();
}

export class ClientController {
	private readonly client: Client;
	private readonly worldRepository: WorldRepository =
		container.resolve(WorldRepository);
	private readonly partyRepository: PartyRepository =
		container.resolve(PartyRepository);
	private readonly settlementRepository: SettlementRepository =
		container.resolve(SettlementRepository);
	private readonly resourceNodeRepository: ResourceNodeRepository =
		container.resolve(ResourceNodeRepository);
	private readonly regionRepository: RegionRepository =
		container.resolve(RegionRepository);
	private readonly expeditionRepository: ExpeditionRepository =
		container.resolve(ExpeditionRepository);
	private readonly voyageFactory: VoyageFactory =
		container.resolve(VoyageFactory);
	private readonly partyFactory: PartyFactory =
		container.resolve(PartyFactory);
	private readonly expeditionFactory: ExpeditionFactory =
		container.resolve(ExpeditionFactory);
	private readonly travelTimeCalculator: TravelTimeCalculator =
		container.resolve(TravelTimeCalculator);

	constructor(
		private readonly socket: Socket<
			ClientToServerEvents,
			ServerToClientEvents,
			any,
			SocketData
		>
	) {
		this.client = new Client();
		socket.data.client = this.client;
		this.handleSocket();
	}

	private handleSocket(): void {
		this.handlePartyInitialization();
		this.handlePartyCreation();
		this.handleSurvivorManagement();

		this.handleTravel();
		this.handleExpedition();

		this.socket.on('world:list', async (callback) => {
			const worlds = await this.worldRepository.getAll();

			callback(
				await Promise.all(
					worlds.map((world) => world.normalize(this.client))
				)
			);
		});

		this.socket.on('settlement:list', async ({ worldId }, callback) => {
			const world = await this.worldRepository.get(worldId);
			if (world === null) {
				ClientNotifier.error(
					'This world does not exist',
					this.socket.id
				);
				return;
			}

			const settlements: SettlementClientData[] = [];
			for (const region of await world.getRegions()) {
				const settlement = await region.getSettlement();
				if (settlement === null) {
					continue;
				}

				settlements.push(await settlement.normalize(this.client));
			}

			callback(settlements);
		});

		this.socket.on(
			'travel:calculate',
			async ({ originId, targetId }, callback) => {
				const origin = await this.regionRepository.get(originId);
				if (!origin) {
					callback(null);
					return; //todo handle error
				}

				const target = await this.regionRepository.get(targetId);
				if (!target) {
					callback(null);
					return; //todo handle error
				}

				if (
					(await origin.getWorld()).getId() !==
					(await target.getWorld()).getId()
				) {
					callback(null);
					return;
				}

				callback(
					await this.travelTimeCalculator.calculateTravelTime(
						origin,
						target
					)
				);
			}
		);
	}

	private handlePartyInitialization(): void {
		this.socket.on('party:init', async (token: string) => {
			if (token.length === 0) {
				return; //TODO add error handling
			}

			const payload = jwt.verify(token, secret) as PartyPayload; //TODO add error handling

			const party = await this.partyRepository.get(payload.party);
			if (party === null) {
				return; //TODO error handling
			}

			await this.initializeParty(party);
		});
	}

	private handlePartyCreation(): void {
		this.socket.on(
			'party:create',
			async (
				data: { name: string; settlementId: SettlementId },
				callback: (token: string) => void
			) => {
				console.log('create party', data);

				const settlement = await this.settlementRepository.get(
					data.settlementId ?? ('a' as SettlementId)
				);
				if (settlement === null) {
					ClientNotifier.error(
						'This settlement does not exist.',
						this.socket.id
					);
					return;
				}

				const name = data.name;
				const world = await (await settlement.getRegion()).getWorld();
				for (const region of await world.getRegions()) {
					for (const existingParty of (await (
						await region.getSettlement()
					)?.getParties()) ?? []) {
						if (existingParty.name === name) {
							ClientNotifier.error(
								'Party name is already in use in this world.',
								this.socket.id
							);
							return;
						}
					}
				}

				const newParty = await this.partyFactory.create(
					name,
					settlement
				);

				const payload: PartyPayload = {
					party: newParty.getId(),
					world: world.getId(),
				};

				const token = jwt.sign(payload, secret);
				callback(token);

				await this.initializeParty(newParty as Party);
			}
		);
	}

	private async initializeParty(party: Party) {
		if (this.client.parties.has(party.getId())) {
			ClientNotifier.warning(
				'This party is already added to this session',
				this.socket.id
			);
			return;
		}

		console.log(
			`adding party "${party.name} (${party.getId()})" to ${
				this.socket.id
			}`
		);

		this.client.parties.set(party.getId(), party);
		party.sockets.push(this.socket); //TODO remove after disconnect

		const settlement = await party.getSettlement();
		const region = await settlement.getRegion();
		const world = await region.getWorld();

		this.socket.join(party.getEntityRoomName());
		this.socket.join(settlement.getEntityRoomName());
		this.socket.join(region.getEntityRoomName());
		this.socket.join(world.getEntityRoomName());
	}

	private handleTravel(): void {
		this.socket.on('voyage:start', async ({ partyId, targetId }) => {
			const party = await this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}

			if ((await party.getSettlement()).getId() === targetId) {
				ClientNotifier.error(
					'Party is already in this settlement',
					await party.getUpdateRoomName()
				);
				return;
			}

			const target = await this.settlementRepository.get(targetId);
			if (target === null) {
				ClientNotifier.error(
					'This settlement does not exist.',
					await party.getUpdateRoomName()
				);
				return;
			}

			await this.voyageFactory.create(party, target);
			ClientNotifier.success(
				`Party "${party.name}" is starting it's voyage to settlement "${target.name}".`,
				await party.getUpdateRoomName()
			);
		});
	}

	private handleExpedition(): void {
		this.socket.on('expedition:start', async ({ partyId, targetId }) => {
			const party = await this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}
			const target = await this.resourceNodeRepository.get(targetId);
			if (target === null) {
				ClientNotifier.error(
					'This resource node does not exist.',
					await party.getUpdateRoomName()
				);
				return;
			}

			await this.expeditionFactory.create(party, target);
			ClientNotifier.success(
				`Party "${party.name}" is starting it's expedition to ${target.name}.`,
				await party.getUpdateRoomName()
			);
		});

		this.socket.on('expedition:list', async ({ partyId }, callback) => {
			const party = this.getParty(partyId);
			if (!party) {
				return null;
			}

			const expeditions = await this.expeditionRepository.getAllByParty(
				partyId
			);
			callback(
				await Promise.all(
					expeditions.map(async (expedition) =>
						expedition.normalize(this.client)
					)
				)
			);
		});
	}

	private async validatePartyForActivity(id: PartyId): Promise<Party | null> {
		const party =
			this.client.parties.get(id) ?? id === 'test'
				? Array.from(this.client.parties.values())[0]
				: null;
		if (!party) {
			ClientNotifier.error(
				"You don't control this party.",
				this.socket.id
			);

			return null;
		}

		if ((await party.getVoyage()) !== null) {
			ClientNotifier.error(
				`Party "${party.name}" is on a voyage.`,
				await party.getUpdateRoomName()
			);

			return null;
		}

		if ((await party.getExpedition()) !== null) {
			ClientNotifier.error(
				`Party "${party.name}" is on an expedition.`,
				await party.getUpdateRoomName()
			);

			return null;
		}

		return party;
	}

	private handleSurvivorManagement(): void {
		this.socket.on('survivor:recruit', async ({ partyId, survivorId }) => {
			const party = await this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}

			const settlement = await party.getSettlement();
			for (const survivor of await settlement.getSurvivors()) {
				if (survivor.getId() !== survivorId) {
					continue;
				}

				await settlement.transferSurvivorTo(survivor, party);

				ClientNotifier.success(
					`${survivor.name} has been added to party "${party.name}"`,
					await party.getUpdateRoomName()
				);

				return;
			}

			ClientNotifier.error(
				'This survivor is not accessible to this party.',
				await party.getUpdateRoomName()
			);
		});

		this.socket.on('survivor:dismiss', async ({ partyId, survivorId }) => {
			const party = await this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}

			for (const survivor of await party.getSurvivors()) {
				if (survivor.getId() !== survivorId) {
					continue;
				}

				await party.transferSurvivorTo(
					survivor,
					await party.getSettlement()
				);

				ClientNotifier.success(
					`${survivor.name} has left party "${party.name}"`,
					await party.getUpdateRoomName()
				);

				return;
			}

			ClientNotifier.error(
				'This survivor is not accessible to this party.',
				await party.getUpdateRoomName()
			);
		});
	}

	private getParty(id: PartyId): Party | null {
		const party =
			this.client.parties.get(id) ?? id === 'test'
				? Array.from(this.client.parties.values())[0]
				: null;
		if (party === null) {
			ClientNotifier.error(
				"You don't control this party",
				this.socket.id
			);
		}

		return party;
	}
}
