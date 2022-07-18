import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { CharacterId } from '../entity/Character.js';
import { WorldId } from '../entity/World.js';

const secret = 'CHANGE ME QUICK!'; //TODO I mean it!

type CharacterPayload = {
	character: CharacterId;
	world: WorldId;
};

export class ClientController {
	constructor(private readonly socket: Socket, private readonly io: Server) {
		this.initializeClient();
		this.handleSocket();
	}

	private initializeClient(): void {
		this.socket.emit('initialize', 'test');
		console.log(this.socket.id + ' is initialized.');
	}

	private handleSocket(): void {
		this.socket.on('add-character', (token: string) => {
			const payload = jwt.decode(token) as CharacterPayload;
			console.log('add-character', payload);

			this.socket.join('character:' + payload.character);
			this.socket.join('world:' + payload.world);
		});

		this.socket.on(
			'create-character',
			(data, callback: { (token: string): void }) => {
				console.log('create-character', data);

				const payload: CharacterPayload = {
					character: 1 as CharacterId,
					world: 1 as WorldId,
				};

				const token = jwt.sign(payload, secret);
				callback(token);
			}
		);
	}
}
