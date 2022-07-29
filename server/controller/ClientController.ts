import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';
import { Party, PartyId } from '../entity/Party.js';
import { Settlement, SettlementId } from '../entity/Settlement.js';
import { WorldId } from '../entity/World.js';
import { ExpeditionFactory } from '../factory/ExpeditionFactory.js';
import { PartyFactory } from '../factory/PartyFactory.js';
import { VoyageFactory } from '../factory/VoyageFactory.js';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { PartyRepository } from '../repository/PartyRepository.js';
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
	private readonly voyageFactory: VoyageFactory =
		container.resolve(VoyageFactory);
	private readonly partyFactory: PartyFactory =
		container.resolve(PartyFactory);
	private readonly expeditionFactory: ExpeditionFactory =
		container.resolve(ExpeditionFactory);

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

		this.handleTravel();
		this.handleExpedition();

		this.socket.on('world:list', (callback) => {
			callback(
				this.worldRepository
					.getAll()
					.map((world) => world.normalize(this.client))
			);
		});

		this.socket.on('settlement:list', ({ worldId }, callback) => {
			console.log(callback);
			const world = this.worldRepository.get(worldId);
			if (world === null) {
				ClientNotifier.error(
					'This world does not exist',
					this.socket.id
				);
				return;
			}

			const regionsWithSettlement = world
				.getRegions()
				.filter((region) => region.getSettlement());
			const settlements = regionsWithSettlement.map((region) =>
				(region.getSettlement() as Settlement).normalize(this.client)
			);
			callback(settlements);
		});
	}

	private handlePartyInitialization(): void {
		this.socket.on('party:init', (token: string) => {
			if (token.length === 0) {
				return; //TODO add error handling
			}

			const payload = jwt.verify(token, secret) as PartyPayload; //TODO add error handling

			const party = this.partyRepository.get(payload.party);
			if (party === null) {
				return; //TODO error handling
			}

			this.initializeParty(party);
		});
	}

	private handlePartyCreation(): void {
		this.socket.on(
			'party:create',
			(
				data: { name: string; settlementId: SettlementId },
				callback: (token: string) => void
			) => {
				console.log('create party', data);

				const settlement = this.settlementRepository.get(
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
				const world = settlement.getRegion().getWorld();
				for (const region of world.getRegions()) {
					for (const existingParty of region
						.getSettlement()
						?.getParties() ?? []) {
						if (existingParty.name === name) {
							ClientNotifier.error(
								'Party name is already in use in this world.',
								this.socket.id
							);
							return;
						}
					}
				}

				const newParty = this.partyFactory.create(name, settlement);

				const payload: PartyPayload = {
					party: newParty.getId(),
					world: world.getId(),
				};

				const token = jwt.sign(payload, secret);
				callback(token);

				this.initializeParty(newParty as Party);
			}
		);
	}

	private initializeParty(party: Party): void {
		if (this.client.parties.has(party.getId())) {
			console.log('Not gonna initialize this party again.');
			return;
		}

		console.log(
			`adding party "${party.name} (${party.getId()})" to ${
				this.socket.id
			}`
		);

		this.client.parties.set(party.getId(), party);
		party.sockets.push(this.socket); //TODO remove after disconnect

		const settlement = party.getSettlement();
		const region = settlement.getRegion();
		const world = region.getWorld();

		this.socket.join(party.getEntityRoomName());
		this.socket.join(settlement.getEntityRoomName());
		this.socket.join(region.getEntityRoomName());
		this.socket.join(world.getEntityRoomName());
	}

	private handleTravel(): void {
		this.socket.on('voyage:start', ({ partyId, targetId }): void => {
			const party = this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}

			if (party.getSettlement().getId() === targetId) {
				ClientNotifier.error(
					'Party is already in this settlement',
					party.getUpdateRoomName()
				);
				return;
			}

			const target = this.settlementRepository.get(targetId);
			if (target === null) {
				ClientNotifier.error(
					'This settlement does not exist.',
					party.getUpdateRoomName()
				);
				return;
			}

			this.voyageFactory.create(party, target);
			ClientNotifier.success(
				`Party "${party.name}" is starting it's voyage to settlement "${target.name}".`,
				party.getUpdateRoomName()
			);
		});
	}

	private handleExpedition(): void {
		this.socket.on('expedition:start', ({ partyId, targetId }): void => {
			const party = this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}
			const target = this.resourceNodeRepository.get(targetId);
			if (target === null) {
				ClientNotifier.error(
					'This resource node does not exist.',
					party.getUpdateRoomName()
				);
				return;
			}

			this.expeditionFactory.create(party, target);
			ClientNotifier.success(
				`Party "${party.name}" is starting it's expedition to ${target.name}.`,
				party.getUpdateRoomName()
			);
		});
	}

	private validatePartyForActivity(id: PartyId): Party | null {
		const party =
			this.client.parties.get(id) ?? id === 'test'
				? Array.from(this.client.parties.values())[0]
				: null;
		if (!party) {
			ClientNotifier.error(
				"You can't control this party",
				this.socket.id
			);

			return null;
		}

		if (party.getVoyage() !== null) {
			ClientNotifier.error(
				'Party is already on a voyage',
				party.getUpdateRoomName()
			);

			return null;
		}

		if (party.getExpedition() !== null) {
			ClientNotifier.error(
				'Party is already on an expedition',
				party.getUpdateRoomName()
			);

			return null;
		}

		return party;
	}
}
