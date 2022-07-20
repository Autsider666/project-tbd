import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Character, CharacterId } from '../entity/Character.js';
import { RegionId } from '../entity/Region.js';
import { WorldId } from '../entity/World.js';
import { CharacterRepository } from '../repository/CharacterRepository.js';
import { ClientToServerEvents, ServerToClientEvents } from '../socket.io.js';

const secret = 'CHANGE ME QUICK!'; //TODO I mean it!

type CharacterPayload = {
	character: CharacterId;
	world: WorldId;
};

export class ClientController {
	private characters = new Map<CharacterId, Character>();

	constructor(
		private readonly socket: Socket<
			ClientToServerEvents,
			ServerToClientEvents
		>,
		private readonly io: Server<ClientToServerEvents, ServerToClientEvents>,
		private readonly characterRepository: CharacterRepository
	) {
		this.handleSocket();
	}

	private handleSocket(): void {
		this.socket.on('character:init', (token: string) => {
			console.log({token})
			const payload = jwt.verify(token, secret) as CharacterPayload; //TODO add error handling

			console.log('entity:character:create', payload);

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

				const newCharacter = this.characterRepository.createEntity({
					name: data.name,
					region: 1 as RegionId,
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
		if (this.characters.has(character.getId())) {
			console.log('Not gonna initialize this character again.');
			return;
		}

		console.log(
			`adding character "${character.name} (${character.getId()})" to ${this.socket.id
			}`
		);

		const region = character.getRegion();
		const world = region.getWorld();

		this.socket.join(character.getEntityRoomName());
		this.socket.join(region.getEntityRoomName());
		this.socket.join(world.getEntityRoomName());

		this.characters.set(character.getId(), character);
	}
}
