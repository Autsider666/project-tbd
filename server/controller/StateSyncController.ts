import { Server } from 'socket.io';
import { SocketId } from 'socket.io-adapter';
import { Entity } from '../entity/Entity.js';
import { World } from '../entity/World.js';
import { ServerState } from '../ServerState.js';
import { ClientToServerEvents, ServerToClientEvents } from '../socket.io.js';

export class StateSyncController {
	constructor(
		private readonly serverState: ServerState,
		private readonly io: Server<ClientToServerEvents, ServerToClientEvents>
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

		if (room.startsWith('entity:world:')) {
			const worldId = parseInt(room.replace('entity:world:', ''));
			const world = this.serverState.getRepository(World).get(worldId);
			if (world === null || world.constructor !== World) {
				throw new Error('Tried to initialize a non-existent world');
			}

			this.initializeAllEntitiesOfWorld(world);
		}
	}

	private initializeAllEntitiesOfWorld(world: World): void {
		const entities = new Map<string, Entity<any, any>>();

		entities.set(world.getEntityRoomName(), world);

		const regions = world.getRegions();
		regions.forEach((region) => {
			entities.set(region.getEntityRoomName(), region);

			region
				.getBorders()
				.forEach((border) =>
					entities.set(border.getEntityRoomName(), border)
				);
		});

		this.io.emit('entity:update', Array.from(entities.values()));
	}
}
