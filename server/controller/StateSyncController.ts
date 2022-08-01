import EventEmitter from 'events';
import { Server } from 'socket.io';
import { SocketId } from 'socket.io-adapter';
import { injectable } from 'tsyringe';
import { Entity, EntityClientData } from '../entity/Entity.js';
import { World, WorldId } from '../entity/World.js';
import { WorldRepository } from '../repository/WorldRepository.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';
import debounce from 'debounce';

export type EntityUpdate = { [key: string]: EntityClientData<any> | null };
export type EntityUpdatePrep = { [key: string]: Entity<any, any, any> | null };

@injectable()
export class StateSyncController {
	private readonly entityUpdateQueue = new Map<string, EntityUpdatePrep>();

	constructor(
		private readonly worldRepository: WorldRepository,
		private readonly io: Server<
			ClientToServerEvents,
			ServerToClientEvents,
			any,
			SocketData
		>,
		private readonly eventEmitter: EventEmitter
	) {
		const debouncedUpdate = debounce(
			async () => await this.emitEntities(),
			250
		);
		this.eventEmitter.on(
			'emit:entity',
			async (entity: Entity<any, any, any>) => {
				const entityUpdate =
					this.entityUpdateQueue.get(
						await entity.getUpdateRoomName()
					) ?? ({} as EntityUpdatePrep);

				entityUpdate[entity.getEntityRoomName()] = entity;

				this.entityUpdateQueue.set(
					await entity.getUpdateRoomName(),
					entityUpdate
				);

				await debouncedUpdate();
			}
		);

		//TODO just do it better
		this.eventEmitter.on(
			'emit:entity:delete',
			async (entity: Entity<any, any, any>) => {
				const entityUpdate =
					this.entityUpdateQueue.get(
						await entity.getUpdateRoomName()
					) ?? ({} as EntityUpdatePrep);

				console.log(
					'Queued for delete emit:',
					entity.getEntityRoomName()
				);

				entityUpdate[entity.getEntityRoomName()] = null;

				this.entityUpdateQueue.set(
					await entity.getUpdateRoomName(),
					entityUpdate
				);

				await debouncedUpdate();
			}
		);

		this.io
			.of('/')
			.adapter.on(
				'join-room',
				async (room, id) => await this.initialSync(room, id)
			);
	}

	private async initialSync(room: string, id: SocketId): Promise<void> {
		console.log(`socket ${id} has joined room ${room}`);
		const socket = this.io.sockets.sockets.get(id);
		if (!socket) {
			throw new Error('Why?');
		}

		if (room.startsWith('entity:world:')) {
			const worldId = room.replace('entity:world:', '') as WorldId;
			const world = await this.worldRepository.get(worldId);
			if (world === null || world.constructor !== World) {
				throw new Error('Tried to initialize a non-existent world');
			}

			socket.emit(
				'entity:update',
				await world.prepareNestedEntityUpdate({}, socket.data.client)
			);
		}
	}

	private async emitEntities(): Promise<void> {
		this.entityUpdateQueue.forEach((update, room) => {
			if (room === '') {
				return;
			}

			console.log(
				'emitting',
				Object.values(update).length,
				'entities to',
				room
			);

			this.io
				.to(room)
				.allSockets()
				.then((sockets) => {
					sockets.forEach(async (id) => {
						const socket = this.io.sockets.sockets.get(id);
						if (!socket) {
							throw new Error('Why here?');
						}

						let entityUpdate: EntityUpdate = {};
						for (const entity of Object.values(update)) {
							entityUpdate = entity
								? await entity.prepareEntityUpdate(
										entityUpdate,
										socket.data.client
								  )
								: entityUpdate;
						}

						socket.emit('entity:update', entityUpdate);
					});
				});
		});

		this.entityUpdateQueue.clear();
	}
}
