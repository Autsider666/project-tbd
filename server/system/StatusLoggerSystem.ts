import { singleton } from 'tsyringe';
import { System } from './System.js';

@singleton()
export class StatusLoggerSystem implements System {
	private turn: number = 1;

	async tick(): Promise<void> {
		console.log('Turn ' + this.turn++ + ' at ' + new Date());
		for (const [key, value] of Object.entries(process.memoryUsage())) {
			console.log(`Memory usage by ${key}, ${value / 1000000}MB `);
		}
	}
}
