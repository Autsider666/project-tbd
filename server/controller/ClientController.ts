import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Character, CharacterId } from '../entity/Character.js';
import { EventId } from '../entity/Event.js';
import { RegionId } from '../entity/Region.js';
import { WorldId } from '../entity/World.js';
import { CharacterRepository } from '../repository/CharacterRepository.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';

const secret = 'CHANGE ME QUICK!'; //TODO I mean it!

type CharacterPayload = {
	character: CharacterId;
	world: WorldId;
};

export class Client {
	public readonly characters = new Map<CharacterId, Character>();
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
		private readonly characterRepository: CharacterRepository
	) {
		this.client = new Client();
		socket.data.client = this.client;
		this.handleSocket();
	}

	private handleSocket(): void {
		this.socket.on('character:init', (token: string) => {
			if (token.length === 0) {
				return; //TODO add error handling
			}

			const payload = jwt.verify(token, secret) as CharacterPayload; //TODO add error handling

			const character = this.characterRepository.get(payload.character);
			if (character === null) {
				return; //TODO error handling
			}

			this.initializeCharacter(character);
		});

		this.socket.on(
			'character:create',
			(data: { name: string }, callback: (token: string) => void) => {
				console.log('create character', data);

				const newCharacter = this.characterRepository.create({
					name: data.name,
					region: 'a' as RegionId,
					currentTravelEvent: 'a' as EventId,
				});

				const payload: CharacterPayload = {
					character: newCharacter.getId(),
					world: newCharacter.getRegion().getWorld().getId(),
				};

				const token = jwt.sign(payload, secret);
				callback(token);

				this.initializeCharacter(newCharacter as Character);
			}
		);
	}

	private initializeCharacter(character: Character): void {
		if (this.client.characters.has(character.getId())) {
			console.log('Not gonna initialize this character again.');
			return;
		}

		console.log(
			`adding character "${character.name} (${character.getId()})" to ${
				this.socket.id
			}`
		);

		const region = character.getRegion();
		const world = region.getWorld();

		this.socket.join(character.getEntityRoomName());
		this.socket.join(region.getEntityRoomName());
		this.socket.join(world.getEntityRoomName());

		this.client.characters.set(character.getId(), character);
	}
}
