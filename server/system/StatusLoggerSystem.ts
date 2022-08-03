import { singleton } from 'tsyringe';
import { System } from './System.js';

@singleton()
export class StatusLoggerSystem implements System {
	private turn: number = 1;

	tick(now: Date): void {
		console.log('Tick ' + this.turn++ + ' at ' + now);
		for (const [key, value] of Object.entries(process.memoryUsage())) {
			console.log(`Memory usage by ${key}, ${value / 1000000}MB `);
		}
	}
}
