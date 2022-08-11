import { Server } from 'socket.io';
import { singleton } from 'tsyringe';
import { WorldFactory } from '../factory/WorldFactory.js';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { WorldRepository } from '../repository/WorldRepository.js';
import { ServerConfig } from '../serverConfig.js';
import { System } from './System.js';

@singleton()
export class WorldStatusSystem implements System {
	constructor(
		private readonly io: Server,
		private readonly worldRepository: WorldRepository,
		private readonly worldFactory: WorldFactory
	) {}

	tick(now: Date): void {
		for (const world of this.worldRepository
			.getAll()
			.filter((world) => !world.destroyedAt)) {
			let isDestroyed = true;
			for (const region of world.getRegions()) {
				const settlement = region.getSettlement();
				if (!settlement || settlement.destroyedAt) {
					continue;
				}

				isDestroyed = false;
				break;
			}

			if (!isDestroyed) {
				continue;
			}

			world.destroyedAt = now.toString();

			ClientNotifier.error(
				`The world has been destroyed!`,
				world.getUpdateRoomName()
			);

			this.worldFactory.create();
		}
	}
}
