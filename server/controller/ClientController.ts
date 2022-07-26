import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Party, PartyId } from '../entity/Party.js';
import { Settlement, SettlementId } from '../entity/Settlement.js';
import { Voyage } from '../entity/Voyage.js';
import { WorldId } from '../entity/World.js';
import { VoyageFactory } from '../factory/VoyageFactory.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { VoyageRepository } from '../repository/VoyageRepository.js';
import { ServerState } from '../ServerState.js';
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
	private readonly partyRepository: PartyRepository;
	private readonly voyageFactory: VoyageFactory;

	constructor(
		private readonly socket: Socket<
			ClientToServerEvents,
			ServerToClientEvents,
			any,
			SocketData
		>,
		private readonly io: Server<
			ClientToServerEvents,
			ServerToClientEvents,
			any,
			SocketData
		>,
		private readonly serverState: ServerState
	) {
		this.client = new Client();
		this.partyRepository = this.serverState.getRepository(
			Party
		) as PartyRepository;
		this.voyageFactory = new VoyageFactory(
			this.serverState.getRepository(Voyage) as VoyageRepository
		);
		socket.data.client = this.client;
		this.handleSocket();
	}

	private handleSocket(): void {
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

		this.socket.on(
			'party:create',
			(data: { name: string }, callback: (token: string) => void) => {
				console.log('create party', data);

				const newParty = this.partyRepository.createNew(
					data.name,
					'a' as SettlementId
				);

				const payload: PartyPayload = {
					party: newParty.getId(),
					world: newParty
						.getSettlement()
						.getRegion()
						.getWorld()
						.getId(),
				};

				const token = jwt.sign(payload, secret);
				callback(token);

				this.initializeParty(newParty as Party);
			}
		);

		this.socket.on('party:travel', ({ partyId, targetId }): void => {
			const party =
				this.client.parties.get(partyId) ??
				Array.from(this.client.parties.values())[0];
			if (!party) {
				console.error('No valid party id');
				return; //TODO Handle callback;
			}

			if (party.getVoyage() !== null) {
				console.error('Party is already on a voyage');
				return; //TODO more error stuff
			}

			if (party.getSettlement().getId() === targetId) {
				console.error('Party is already in this settlement');
				return;
			}

			const target = this.serverState
				.getRepository(Settlement)
				.get(targetId);
			if (target === null) {
				console.error('target is not a valid settlement id');
				return; //TODO error stuff
			}

			this.voyageFactory.create(party, target);
			console.log('Voyage started.', party);
		});
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

		const settlement = party.getSettlement();
		const region = settlement.getRegion();
		const world = region.getWorld();

		this.socket.join(party.getEntityRoomName());
		this.socket.join(settlement.getEntityRoomName());
		this.socket.join(region.getEntityRoomName());
		this.socket.join(world.getEntityRoomName());
	}
}
