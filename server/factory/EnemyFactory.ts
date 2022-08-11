import { singleton } from 'tsyringe';
import { Enemy } from '../entity/CommonTypes/Combat.js';
import { World } from '../entity/World.js';

@singleton()
export class EnemyFactory {
	public create(
		enemy: Omit<Enemy, 'damageTaken'>,
		now: Date,
		world: World
	): Enemy {
		const createdAt = world.createdAt;
		const worldAge = Math.floor(
			(now.getTime() - new Date(createdAt).getTime()) / (60000 * 60)
		);

		return {
			// ...enemy,
			name: enemy.name,
			hp: Math.round(enemy.hp * Math.pow(1.05, worldAge)),
			damage: Math.round(enemy.damage * Math.pow(1.02, worldAge)),
			damageTaken: 0,
		};
	}
}
