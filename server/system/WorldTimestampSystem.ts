import { Server } from 'socket.io';
import { singleton } from 'tsyringe';
import { ServerConfig } from '../serverConfig.js';
import { System } from './System.js';

@singleton()
export class WorldTimestampSystem implements System {
	constructor(
		private readonly io: Server,
		private readonly config: ServerConfig
	) {}

	async tick(now: Date): Promise<void> {
		this.io.emit('server:turn', {
			startedAt: now,
			endsAt: new Date(now.getTime() + this.config.get('serverTickTime')),
		});
	}
}
