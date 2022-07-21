import { Server } from 'socket.io';
import { SocketId } from 'socket.io-adapter';
import { Character } from '../entity/Character.js';
import { Entity, EntityClientData } from '../entity/Entity.js';
import { World } from '../entity/World.js';
import { ServerState } from '../ServerState.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';

export type EntityUpdate = { [key: string]: EntityClientData<any> | null };

export class StateSyncController {
	constructor(
		private readonly serverState: ServerState,
		private readonly io: Server<
			ClientToServerEvents,
			ServerToClientEvents,
			any,
			SocketData
		>
	) {
		const repository = this.serverState.getRepository(World);
		if (!repository) {
			throw new Error(
				'WorldRepository is not registered to ServerState.'
			);
		}

		this.io
			.of('/')
			.adapter.on('join-room', (room, id) => this.initialSync(room, id));
	}

	private initialSync(room: string, id: SocketId): void {
		console.log(`socket ${id} has joined room ${room}`);
		const socket = this.io.sockets.sockets.get(id);
		if (!socket) {
			throw new Error('Why?');
		}

		if (room.startsWith('entity:world:')) {
			const worldId = room.replace('entity:world:', '');
			const world = this.serverState.getRepository(World).get(worldId);
			if (world === null || world.constructor !== World) {
				throw new Error('Tried to initialize a non-existent world');
			}

			this.io
				.to(room)
				.emit(
					'entity:update',
					world.prepareUpdate({}, socket.data.client)
				);
		}

		if (room.startsWith('entity:character:')) {
			const characterId = room.replace('entity:character:', '');
			const character = this.serverState
				.getRepository(Character)
				.get(characterId);
			if (character === null || character.constructor !== Character) {
				throw new Error('Tried to initialize a non-existent character');
			}

			this.io
				.to(room)
				.emit(
					'entity:update',
					character.prepareUpdate({}, socket.data.client)
				);
		}
	}
}
