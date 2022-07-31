import { Server } from 'socket.io';
import { singleton } from 'tsyringe';
import { ServerTickTime } from '../controller/ServerController.js';
import { System } from './System.js';

@singleton()
export class WorldTimestampSystem implements System {
	constructor(private readonly io: Server) {}

	async tick(now: Date): Promise<void> {
		this.io.emit('server:turn', {
			startedAt: now,
			endsAt: new Date(now.getTime() + ServerTickTime),
		});
	}
}
