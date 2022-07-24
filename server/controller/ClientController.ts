import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Party, PartyId } from '../entity/Party.js';
import { EventId } from '../entity/Event.js';
import { RegionId } from '../entity/Region.js';
import { SettlementId } from '../entity/Settlement.js';
import { WorldId } from '../entity/World.js';
import { PartyRepository } from '../repository/PartyRepository.js';
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
		private readonly partyRepository: PartyRepository
	) {
		this.client = new Client();
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

		const settlement = party.getSettlement();
		const region = settlement.getRegion();
		const world = region.getWorld();

		this.socket.join(party.getEntityRoomName());
		this.socket.join(settlement.getEntityRoomName());
		this.socket.join(region.getEntityRoomName());
		this.socket.join(world.getEntityRoomName());

		this.client.parties.set(party.getId(), party);
	}
}
